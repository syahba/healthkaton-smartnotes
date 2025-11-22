const { spawn } = require("child_process");
const path = require("path");
const { summarize } = require("../ai/summarize");

function runPython(script, arg) {
  const rootDir = path.resolve(__dirname, "..");
  const scriptPath = path.join(rootDir, "ai", script);

  let finalFilePath;

  if (path.isAbsolute(arg)) {
    finalFilePath = arg;
  } else {
    finalFilePath = path.join(rootDir, "uploads", arg);
  }

  console.log(`🚀 Starting Python Script: ${script}`);
  console.log(`📂 Target File: ${finalFilePath}`); // Optional debug

  return new Promise((resolve, reject) => {
    const pythonProcess = spawn("python", ["-u", scriptPath, finalFilePath], {
      cwd: rootDir,
    });

    let outputData = "";

    pythonProcess.stdout.on("data", (data) => {
      const message = data.toString();
      console.log(`[Python stdout]: ${message}`);
      outputData += message;
    });

    pythonProcess.stderr.on("data", (data) => {
      console.error(`[Python stderr]: ${data.toString()}`);
    });

    pythonProcess.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`Python script exited with code ${code}`));
      } else {
        resolve(outputData);
      }
    });
  });
}

async function processAudio(fileName) {
  const transcriptPath = path.join(__dirname, "..", "ai", "transcript.json");
  const structuredPath = path.join(__dirname, "..", "ai", "structured.json");

  // transcribe the audio
  await runPython("transcribe.py", fileName);

  // categorize the speakers (user vs cs)
  await runPython("structure.py", transcriptPath);

  // generate summary
  const summary = await summarize(structuredPath);

  return summary;
}

module.exports = { processAudio };
