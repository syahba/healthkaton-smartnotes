const Summary = require("../models/summaries");
const fs = require("fs");
const { processAudio } = require("../services/hf");
const { formatDate } = require("../helpers/formatDate");

const processCallSummary = async (req, res) => {
  try {
    const { customerName } = req.body;
    const { filename: fileName, path: filePath } = req.file;

    const note = await processAudio(fileName);
    console.log(note)
    
    const doc = {
      customerName,
      csName: note.csName || "CS",
      datetime: formatDate(new Date()),
      topic: note.topic || "",
      summary: note.summary || "",
      steps: note.steps || [],
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
};

const getDetailSummary = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Summary.findById(id);

    res.status(200).send(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  processCallSummary,
  getSummary,
  getDetailSummary,
};
