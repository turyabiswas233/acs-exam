const express = require("express");
const { Exam } = require("../../model/exam.model.js");
const User = require("../../model/user.model.js");
const SubmitExam = require("../../model/submitExam.model.js");

const router = express.Router();

// only show exam details
router.get("/", async (req, res) => {
  let exam;
  try {
    exam = await Exam.find();

    res.status(200).json({
      status: true,
      message: "Successfully got all the exam",
      list: exam,
    });
  } catch (error) {
    console.log(error);
    res.status(404).send({ status: false, message: "Failed to get Exams" });
  }
});
// only show exam details
router.get("/:_id", async (req, res) => {
  const { _id } = req.params;
  try {
    const examInfo = await Exam.findById(_id).populate("questionsList");
    if (examInfo) {
      const data = {
        examname: examInfo.examname,
        starttime: examInfo.starttime,
        endtime: examInfo.endtime,
        duration: examInfo.duration,
        questype: examInfo.questype,
        totalQuestion: examInfo.questionsList?.length,
        questionsList: examInfo.questionsList.map((e) => {
          return {
            id: e?._id,
            question: e.question,
            type: e.questype,
            options: e.options.map((op) => {
              return {
                id: op.id,
                text: op.text,
              };
            }),
          };
        }),
      };
      res.send({ status: true, data: data });
    } else res.send({ status: false, data: null });
  } catch (error) {
    console.log(error);
    res.status(400).send({ status: false, message: "Failed to get data" });
  }
});
// upload|post submition of exam from students
router.post("/submit", async (req, res) => {
  const { userId, submitData, examId } = req.body;
  try {
    const uid = await User.findOne({ uid: userId }).get("_id");
    if (!uid) {
      return res.status(300).send({
        status: false,
        message: "You are not a valied student for this exam",
      });
    }
    const examInfo = await Exam.findById({ _id: examId }).populate(
      "questionsList"
    );

    if (examInfo) {
      const submitExam = new SubmitExam({
        userId,
        examId,
        submitData,
      });
      console.log(submitExam);
      submitExam.save();
      res.send({ status: true, message: "Your data has been submitted" });
    } else
      res
        .status(400)
        .send({ status: false, message: "Failed to store exam data" });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: false,
      message: "Failed to store exam data. Internal sever error",
    });
  }
});
module.exports = router;
