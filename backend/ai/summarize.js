require("dotenv").config({
  path: require("path").join(__dirname, "..", ".env"),
});
const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");
const token = process.env.HF_TOKEN;

async function summarize(structuredPath) {
  const data = JSON.parse(fs.readFileSync(structuredPath, "utf8"));
  const transcript = data.speakers
    .map((s) => `${s.speaker}: ${s.text}`)
    .join("\n");

  const messages = [
    {
      role: "system",
      content: `
        Kamu merangkum percakapan customer service dalam **JSON murni**.

        Format WAJIB:
        {
          "topic": "",
          "csName": "",
          "summary": "",
          "steps": []
        }

        Aturan:
        - Jawab HANYA JSON, tanpa \`\`\`, tanpa teks tambahan
        - 'summary' minimal 2 kalimat, maksimal 4 kalimat
        - 'steps' harus instruksi yang bisa diikuti
        - 'steps' minimal ada 3 langkah, maksimal ada 6 langkah
      `,
    },
    {
      role: "user",
      content: transcript,
    },
  ];

  const body = {
    model: "aisingapore/Gemma-SEA-LION-v3-9B-IT:featherless-ai",
    messages,
    max_tokens: 200,
    temperature: 0.2,
  };

  console.log("Sending request body:", JSON.stringify(body, null, 2));

  const response = await fetch(
    "https://router.huggingface.co/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  const result = await response.json();

  if (!result?.choices?.length) {
    console.error("ERROR: No choices returned!");
    return;
  }

  const output = result.choices[0].message.content.trim();

  const outputPath = path.join(__dirname, "summary.json");

  fs.writeFileSync(outputPath, output);

  console.log(`Successfully saved summary to ${outputPath}`);
  return JSON.parse(output);
}

module.exports = { summarize };
