const Summary = require("../models/summaries");
const fs = require("fs");
const {
  transcribeAudio,
  generateNoteFromTranscript,
} = require("../services/hf");

const processCallSummary = async (req, res) => {
  try {
    const { body: { customerName }, file } = req;
    if (!file)
      return res
        .status(400)
        .json({ message: "audio file required (form field name: audio)" });

    const { path: filePath } = file;
    const transcript = await transcribeAudio(filePath, "id");
    console.log(transcript);
    
    const note = await generateNoteFromTranscript(transcript);

    const doc = {
      customerName,
      csName: note.csName,
      datetime: new Date().format("YYYY-MM-DD HH:mm"),
      topic: note.topic,
      summary: note.summary,
      steps: note.steps,
    };

    fs.unlink(filePath, () => {});

    res.status(201).json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

const getSummary = async (req, res) => {
  try {
    const data = await Summary.find();

    res.status(200).send(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
}

const getDetailSummary = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Summary.findById(id);

    res.status(200).send(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
}

module.exports = {
  processCallSummary,
  getSummary,
  getDetailSummary
};
