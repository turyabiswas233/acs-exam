const mongoose = require("mongoose");
const exmType = [
  "Du Admission",
  "Engineering",
  "BUET",
  "GST",
  "Medical",
  "Academic",
  "Board",
  "নিবন্ধন ১৯",
];
const question = new mongoose.Schema({
  question: { type: String, required: true, maxLength: 20000 },
  options: { type: Array, required: true },
  questype: { type: String, required: true },
  solve: { type: String, maxLength: 20000 },
});
const exam = new mongoose.Schema({
  examname: { type: String, required: true },
  starttime: { type: String, required: true },
  endtime: { type: String, required: true },
  duration: {
    type: Object,
    default: {
      hh: 0,
      mm: 0,
    },
    required: true,
  },
  examtype: { type: String, required: true, enum: exmType },
  questype: { type: String, required: true },
  examclass: { type: String, required: true, enum: ["HSC", "SSC", "Job Exam"] },
  questionsList: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Question", default: [] },
  ],
});

const Exam = mongoose.model("Exams", exam);
const Question = mongoose.model("Question", question);

module.exports = { Exam, Question };
