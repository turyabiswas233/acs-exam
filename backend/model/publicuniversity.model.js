const mongoose = require("mongoose");

const publicuniversitySchema = mongoose.Schema({
  university: String,
  sscGPA: Number,
  hscGPA: Number,
  physicsMarks: Number,
  chemistryMarks: Number,
  mathMarks: Number,
  biologyMarks: Number,
  englishGPA: Number,
  secondTimer: Boolean,
  description: String,
});

const PublicUniversity = mongoose.model(
  "PublicUniversity",
  publicuniversitySchema
);

module.exports = PublicUniversity;
