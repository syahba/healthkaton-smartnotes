require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const summaryRoute = require("./routes/summary");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/summaries", summaryRoute);

const PORT = process.env.PORT || 4000;
async function start() {
  await mongoose.connect(process.env.MONGO_URI, { dbName: "healthkaton" });
  app.listen(PORT, () => console.log("Server listening on", PORT));
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
