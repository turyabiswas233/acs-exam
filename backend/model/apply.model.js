const mongoose = require("mongoose");

const applySchema = new mongoose.Schema({
  universityName: String,
  examName: String,
  applyLink: String,
});

const Apply = mongoose.model("Apply", applySchema);

module.exports = Apply;
