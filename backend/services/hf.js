const fetch = require("node-fetch");
const { exec } = require("child_process");
const path = require("path");

const HF_API = process.env.HF_API_KEY;
const SUMMARIZE_MODEL = process.env.HF_SUMMARIZE_MODEL;

if (!HF_API) {
  console.warn("HF_API_KEY not set. HF calls will fail if used.");
}

const transcribeAudio = async (fileName) => {
  try {
    const scriptPath = path.join(__dirname, "..", "python", "transcribe.py");

    const transcript = await new Promise((resolve, reject) => {
      exec(
        `python "${scriptPath}" "./uploads/${fileName}"`,
        { cwd: path.join(__dirname, "..") },
        (error, stdout, stderr) => {
          if (error) {
            console.error("Python error:", error);
            return reject(new Error("Transcription failed."));
          }

          if (stderr && !stderr.includes("UserWarning")) {
            console.warn("Python warning:", stderr);
          }

          const text = stdout.trim();
          if (!text) {
            return reject(new Error("No transcript returned from Python."));
          }

          resolve(text);
        }
      );
    });

    return transcript;
  } catch (err) {
    console.error("Transcription exception:", err.message);
    throw err;
  }
};

// create summary
const generateNoteFromTranscript = async (transcript) => {
  const test = "halo ada yang bisa saya bantu? iya mbak, saya bingung cara daftar untuk ke faskes, gimana ya? baik, ibu bisa coba masuk ke menu daftar, lalu masukan data diri ya. oh baik, terimakasih."
  const prompt = `
  Ringkas percakapan layanan pelanggan ini, hasilkan dalam JSON:

  {
    "topic": "<maks 12 kata, kata kunci>",
    "csName": "<nama CS atau 'Tidak disebutkan'>",
    "summary": "<ringkasan satu paragraf>",
    "steps": ["aksi1", "aksi2", "aksi3"]
  }

  Teks:
  ${test}
  `;

  const response = await fetch(
    `https://router.huggingface.co/hf-inference/models/${SUMMARIZE_MODEL}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_API}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: prompt }),
    }
  );
  
  if (!response.ok) {
    const txt = await response.text();
    throw new Error(`Summarization failed: ${response.status} ${txt}`);
  }
  
  const data = await response.json();
  console.log(data)
  console.log(data[0])
  const rawOutput = data[0]?.generated_text || data.generated_text || "";
  
  const jsonMatch = rawOutput.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    console.error("Model returned:", rawOutput);
    throw new Error("Model did not return valid JSON");
  }

  const result = JSON.parse(jsonMatch[0]);
  console.log("SUMMARY RESULT:", result);

  return {
    topic: result.topic || "",
    csName: result.csName || "CS",
    summary: result.summary || "",
    steps: result.steps || [],
  };
};

module.exports = { transcribeAudio, generateNoteFromTranscript };
