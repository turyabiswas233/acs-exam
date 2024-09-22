const mongoose = require("mongoose");

const resultSchema = mongoose.Schema({
  universityName: String,
  examName: String,
  resultLink: String,
});

const Result = mongoose.model("Result", resultSchema);

module.exports = Result;
