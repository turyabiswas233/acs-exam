const mongoose = require("mongoose");

const privateuniversitySchema = mongoose.Schema({
  university: String,
  sscGPA: Number,
  hscGPA: Number,
  budget: Number,
  subjects: {
    type: [String],
    unique: true,
  },
  description: String,
});

const privateuniversity = mongoose.model(
  "privateUniversity",
  privateuniversitySchema
);

module.exports = privateuniversity;
