const mongoose = require("mongoose");

const leaderboard = new mongoose.Schema({
  userID: { type: String },
  username: { type: String },
  examname: { type: String },
  subject: { type: String },
  chapter: { type: String },
  examtype: { type: String },
  classtype: { type: String },
  correct: { type: String },
  inCorrect: { type: String },
  total: { type: String },
});

const Leaderboard = mongoose.model("Leaderboard", leaderboard);

module.exports = Leaderboard;
