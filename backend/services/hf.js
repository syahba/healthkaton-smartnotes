const fs = require("fs");
const fetch = require("node-fetch");

const HF_API = process.env.HF_API_KEY;
const TRANSCRIBE_MODEL = process.env.HF_TRANSCRIBE_MODEL;
const SUMMARIZE_MODEL = process.env.HF_SUMMARIZE_MODEL;

if (!HF_API) {
  console.warn("HF_API_KEY not set. HF calls will fail if used.");
}

const transcribeAudio = async (filePath, lang = "id") => {
  const buffer = fs.readFileSync(filePath);

  const res = await fetch(
    `https://router.huggingface.co/fal-ai/fal-ai/whisper`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_API}`,
        "Content-Type": "application/octet-stream",
      },
      body: buffer,
    }
  );
console.log('this is it', res)
  
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Transcription failed: ${res.status} ${txt}`);
  }
  
  const data = await res.json();
  console.log('test', data);
  // const transcript =
  //   data?.text ?? (typeof data === "string" ? data : JSON.stringify(data));
  // return transcript.trim();
}

// create summary
const generateNoteFromTranscript = async (transcript) => {
  const prompt = `
  You are an assistant that summarizes customer service voice calls for MJKN (BPJS Kesehatan).
  Input: a raw call transcript in Bahasa Indonesia.

  Produce a single JSON object EXACTLY with fields:
  {
    "topic": "<one-sentence topic, short & keyword rich>",
    "csName": "<customer service name if found, otherwise fallback>",
    "summary": "<one paragraph summary in simple Bahasa Indonesia>",
    "steps": ["step 1", "step 2", ...]   // 3-6 steps, each short and actionable in Bahasa Indonesia
  }

  Rules:
    - Return ONLY valid JSON and nothing else.
    - Keep 'topic' short (max ~12 words), include key terms.
    - 'summary' must be a clear paragraph that anyone can understand.
    - 'steps' must be 3-6 steps, each concise and actionable (e.g., "Buka menu Pembayaran", "Pilih ...").
    - Use fallback values when the name is not found.

  Transcript:
  """${transcript}"""
  `;

  const res = await fetch(
    `https://api-inference.huggingface.co/models/${SUMMARIZE_MODEL}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_API}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: { max_new_tokens: 512, temperature: 0.0 },
      }),
    }
  );

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Summarization failed: ${res.status} ${txt}`);
  }

  const data = await res.json();

  let textOut = null;
  if (typeof data === "string") textOut = data;
  else
    textOut =
      data?.generated_text ??
      (Array.isArray(data)
        ? data[0]?.generated_text ?? data[0]?.text
        : data.text ?? JSON.stringify(data));

  const jsonMatch = textOut.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error(
      "Model did not return valid JSON. Output: " + textOut.slice(0, 800)
    );
  }

  const parsed = JSON.parse(jsonMatch[0]);

  const topic = parsed.topic?.trim?.() ?? "";
  const csName = parsed.csName?.trim?.() ?? 'CS';
  const summary = parsed.summary?.trim?.() ?? "";
  const steps = Array.isArray(parsed.steps)
    ? parsed.steps.map((s) => String(s).trim())
    : [];

  return { topic, csName, summary, steps };
}

module.exports = { transcribeAudio, generateNoteFromTranscript };
