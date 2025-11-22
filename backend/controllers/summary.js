const Summary = require("../models/summaries");
const fs = require("fs");
const { processAudio } = require("../services/hf");
const { formatDate } = require("../helpers/formatDate");
const Step = require("../models/steps");

const processCallSummary = async (req, res) => {
  try {
    const { customerName } = req.body;
    const { filename: fileName, path: filePath } = req.file;

    // const data = await processAudio(fileName);

    const data = {
      customerName: "syahba",
      csName: "Shabad M. Sri",
      datetime: "22 Nov 2025, 20:11",
      topic: "Pendaftaran BPJS",
      summary:
        "Customer ingin tahu cara mendaftar BPJS. CS menjelaskan langkah-langkah pendaftaran, yaitu membuka menu pendaftaran, mengisi data diri, menunggu OTP, dan mengaktifkan BPJS.",
      steps: [
        "Buka menu pendaftaran pada aplikasi atau website BPJS.",
        "Isi data diri dengan lengkap dan akurat sesuai yang diminta.",
        "Tunggu OTP (One Time Password) yang akan dikirim ke nomor telepon yang terdaftar.",
        "Masukkan OTP yang diterima untuk mengaktifkan akun BPJS.",
      ],
    };

    const summary = await Summary.create({
      customerName,
      csName: data.csName || "CS",
      topic: data.topic || "",
      summary: data.summary || "",
    });
    const summaryId = summary._id;

    const stepsArr = data.steps.map((v) => ({
      name: v,
      summaryId,
    }));

    const steps = await Step.create(stepsArr);

    const stepIds = steps.map((step) => step._id);

    const finalSummary = await Summary.findByIdAndUpdate(
      summaryId,
      {
        $set: { steps: stepIds },
        progress: 0,
      },
      { new: true }
    );

    fs.unlink(filePath, () => {});
    res.status(201).json(finalSummary);
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
    const { id: summaryId } = req.params;
    if (!summaryId) {
      return res.status(400).json({ message: "Summary ID is required." });
    }

    const data = await Summary.findById(summaryId).populate('steps');

    if (!data) {
      return res.status(404).json({ message: "Summary not found." });
    }

    res.status(200).send(data);
  } catch (err) {
    console.error("Error fetching detailed summary:", err);
    if (err.name === 'CastError') {
      return res.status(400).json({ message: "Invalid Summary ID format." });
    }
    res.status(500).json({ message: err.message });
  }
};

const updateStepStatus = async (req, res) => {
  try {
    const { id: stepId } = req.params;
    if (!stepId) {
      return res.status(400).json({ message: "Step ID is required." });
    }

    const stepToToggle = await Step.findById(stepId);
    if (!stepToToggle) {
      return res.status(404).json({ message: "Step not found." });
    }

    const newStatus = !stepToToggle.isCompleted;
    const updatedStep = await Step.findByIdAndUpdate(
      stepId,
      { isCompleted: newStatus },
      { new: true }
    );

    const summaryId = updatedStep.summaryId;

    const allSteps = await Step.find({ summaryId });

    const completedSteps = allSteps.filter((step) => step.isCompleted).length;
    const totalSteps = allSteps.length;

    const progress =
      totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
    const isFinished = completedSteps === totalSteps;

    const updatedSummary = await Summary.findByIdAndUpdate(
      summaryId,
      {
        $set: {
          progress: progress,
          isFinished: isFinished,
        },
      },
      { new: true }
    ).populate("steps");

    return res.status(200).json({
      step: updatedStep,
      summary: updatedSummary,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  processCallSummary,
  getSummary,
  getDetailSummary,
  updateStepStatus,
};
