const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const summarySchema = new Schema(
  {
    topic: {
      type: String,
      required: true,
    },
    cs: {
      type: String,
      required: true,
    },
    isFinished: {
      type: Boolean,
      default: false,
      required: true,
    },
    summary: {
      type: String,
      required: true,
    },
    steps: {
      type: Schema.ObjectId,
      ref: "steps",
    },
  },
  {
    timestamps: true,
    collection: "summaries",
    versionKey: false,
  }
);

const Summary = mongoose.model("summaries", summarySchema);

module.exports = Summary;
