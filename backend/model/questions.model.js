const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  Question: {
    type: String,
  },
  Options: { type: String },
  Answer: {
    type: String,
  },
  Board: {
    type: String,
  },
  Subject: {
    type: String,
    enum: [
      "BANGLA 1ST PAPER",
      "BANGLA 2ND PAPER",
      "PHYSICS 1ST PAPER",
      "PHYSICS 2ND PAPER",
      "CHEMISTRY 1ST PAPER",
      "CHEMISTRY 2ND PAPER",
      "HIGHER MATH 1ST PAPER",
      "HIGHER MATH 2ND PAPER",
      "BIOLOGY 1ST PAPER",
      "BIOLOGY 2ND PAPER",
      "ICT",
    ],
    required: true,
  },
  Chapter: {
    type: String,
    enum: [
      "Chapter 1",
      "Chapter 2",
      "Chapter 3",
      "Chapter 4",
      "Chapter 5",
      "Chapter 6",
      "Chapter 7",
      "Chapter 8",
      "Chapter 9",
      "Chapter 10",
      "Chapter 11",
      "Chapter 12",
      "Chapter 13",
      "Chapter 14",
    ],
    required: true,
  },
  Level: {
    type: String,
  },
  Type: {
    type: String,
  },
  Solution: {
    type: String,
  },
  Solution_Img: {
    type: String,
  },
  Answer_Img: {
    type: String,
  },
});

const Question = mongoose.model("practice", questionSchema);

module.exports =  Question;
