const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const {
  processCallSummary,
  getSummary,
  getDetailSummary,
  updateStepStatus,
} = require("../controllers/summary");

const uploadDir = process.env.UPLOAD_DIR || "./uploads";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const name =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e6) +
      path.extname(file.originalname);
    cb(null, name);
  },
});
const upload = multer({ storage });

router.get("/", getSummary);
router.get("/:id", getDetailSummary);
router.post("/", upload.single("audio"), processCallSummary);
router.post("/:id", updateStepStatus);

module.exports = router;
