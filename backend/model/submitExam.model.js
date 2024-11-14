const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const submitExamSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId, // shit :) too minor mistake but etto pain :)
    ref: "Users",
    required: true,
  },
  isLiveExam: {
    type: Schema.Types.Boolean,
    required: true,
    default: false,
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
