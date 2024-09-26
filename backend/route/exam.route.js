const express = require("express");
const { Exam } = require("../model/exam.model.js");

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

module.exports = router;
