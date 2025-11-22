const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const summarySchema = new Schema(
  {
    topic: {
      type: String,
      required: true,
    },
    csName: {
      type: String,
      default: 'CS'
    },
    customerName: {
      type: String,
      default: 'Pengguna',
    },
    isFinished: {
      type: Boolean,
      default: false,
    },
    summary: {
      type: String,
      required: true,
    },
    steps: [{
      type: Schema.ObjectId,
      ref: "steps",
    }],
    progress: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
    collection: "summaries",
    versionKey: false,
  }
);

const Summary = mongoose.model("summaries", summarySchema);

module.exports = Summary;
