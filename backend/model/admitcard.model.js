const mongoose = require("mongoose");

const admitcardSchema = mongoose.Schema({
  universityName: String,
  examName: String,
  admitCardLink: String,
});

const admitCard = mongoose.model("Admitcard", admitcardSchema);

module.exports =  admitCard;
