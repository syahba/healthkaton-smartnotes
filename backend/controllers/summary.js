const Summary = require("../models/summaries");
const {
  transcribeAudio,
  generateNoteFromTranscript,
} = require("../services/hf");

const processCallSummary = async (req, res) => {
  try {
    if (!req.file)
      return res
        .status(400)
        .json({ message: "audio file required (form field name: audio)" });

    const { path: filePath } = req.file;
    const transcript = await transcribeAudio(filePath, "id");

    const note = await generateNoteFromTranscript(transcript, {
      csFallback: req.body.csName || "CS",
      userFallback: req.body.userName || "Pengguna",
    });

    const doc = await Summary.create({
      callId: req.body.callId || `call-${Date.now()}`,
      customerName: note.userName,
      csName: note.csName,
      datetime: new Date(note.dateTime),
      topic: note.topic,
      summaryText: note.summary,
      nextSteps: note.nextSteps,
      transcript,
    });

    fs.unlink(filePath, () => {});

    res.status(201).json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  processCallSummary,
};
