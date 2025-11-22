require("dotenv").config();
const mongoose = require("mongoose");
const Summary = require("./models/summaries");

async function seed() {
  await mongoose.connect(process.env.MONGO_URI, { dbName: "healthkaton" });

  await Summary.create({
    topic: "Pendaftaran BPJS Kesehatan",
    csName: "Budi",
    customerName: "Ayu",
    summary: "User meminta bantuan terkait pendaftaran BPJS.",
    progress: 0,
  });

  console.log("Seed done!");
  mongoose.disconnect();
}

seed();
