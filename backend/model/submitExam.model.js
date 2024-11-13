const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const submitExamSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  examId: {
    type: Schema.Types.ObjectId,
    ref: "Exams",
    required: true,
  },
  submitData: {
    type: Array,
    required: true,
  },
});

const SubmitExam = mongoose.model("SubmitExam", submitExamSchema);

module.exports = SubmitExam;
