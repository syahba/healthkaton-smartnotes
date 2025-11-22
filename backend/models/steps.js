const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const stepSummary = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    summaryId: {
      type: Schema.ObjectId,
      ref: "summaries",
    },
  },
  {
    timestamps: true,
    collection: "steps",
    versionKey: false,
  }
);

const Step = mongoose.model("steps", stepSummary);

module.exports = Step;
