const express = require("express");
const { Exam, Question } = require("../../model/exam.model.js");
const router = express.Router();

router.post("/create", async (req, res) => {
  const data = req.body;

  let exam;
  try {
    exam = await Exam.create(data);
    console.log(exam);
    res.status(200).json({
      status: true,
      message: `Successfully Created Exam ${exam?.examname}`,
      data: exam,
    });
  } catch (error) {
    console.log(error);
    res
      .status(404)
      .send({ status: false, message: "Failed to create new Exam" });
  }
});
router.post("/addquestion/:examid", async (req, res) => {
  const data = req.body;
  const { examid } = req.params;

  try {
    const question = await Question.create(data);
    if (question) {
      console.log("question added to server");

      const updatedExam = await Exam.findByIdAndUpdate(
        examid,
        { $push: { questionsList: question._id } },
        { new: true }
      );
      if (updatedExam) {
        console.log("question added to server");
        res.status(200).send({ status: true, message: `Question added` });
      } else
        res.status(400).send({
          status: false,
          message:
            "Failed to update exam but you can manually add this question later.",
        });
    } else
      res.status(400).send({
        status: false,
        message: "Failed to add question. Try again.",
      });
  } catch (error) {
    console.log(error);
    res
      .status(404)
      .send({ status: false, message: "Failed to add question. Try again" });
  }
});
router.post("/delete", async (req, res) => {
  const { _id } = req.body;
  try {
    Exam.findOne({ _id })
      .then((doc) => {
        console.log(doc);
        doc
          .deleteOne()
          .then((deletedDoc) => {
            if (deletedDoc)
              res.status(200).send({
                status: true,
                message: "Successfully Deleted",
                deleteId: deletedDoc,
              });
            else
              res
                .status(404)
                .send({ status: false, message: "Failed to delete" });
          })
          .catch((err) => {
            res
              .status(404)
              .send({ status: false, message: "Failed to delete" });
          });
      })
      .catch((err) => {
        res.status(404).send({ status: false, message: "Failed to delete" });
      });
  } catch (error) {
    res.status(404).send({ status: false, message: "Failed to delete" });
  }
});
router.get("/getAll", async (req, res) => {
  let exam;
  try {
    exam = await Exam.find();
    if (!exam) {
      res
        .status(404)
        .json({ status: false, message: "No Exam has been created" });
    } else {
      res.status(200).json({
        status: true,
        message: "Successfully got all the exam",
        list: exam,
      });
    }
  } catch (error) {
    res.status(404).send({ status: false, message: "Failed to get Exams" });
  }
});
router.get("/getsingleexam", async (req, res) => {
  let exam;
  const { _id } = req.query;
  try {
    exam = await Exam.findById({ _id });
    if (!exam) {
      res.status(404).json({ status: false, message: "No Exam found" });
    } else {
      res.status(200).json({
        status: true,
        message: "Successfully got exam info",
        info: exam,
      });
    }
  } catch (error) {
    res.status(404).send({ status: false, message: "Failed to get Exam" });
  }
});
router.get("/getquestions", async (req, res) => {
  const { qid } = req.query;

  try {
    const questions = await Question.find({ examid: qid });

    if (questions)
      res
        .status(200)
        .send({ status: true, message: `Found questions `, list: questions });
    else
      res
        .status(404)
        .send({ status: false, message: "Failed to get question" });
  } catch (error) {
    console.log(error);
    res.status(404).send({ status: false, message: "Failed to get question" });
  }
});
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
        questionsList: examInfo.questionsList.map((e) => {
          return {
            question: e.question,
            options: e.options.map((op) => {
              return {
                id: op.id,
                text: op.text,
              };
            }),
          };
        }),
      };
      res.send({ status: "success", data: examInfo });
    } else res.send({ status: "failed", data: null });
  } catch (error) {
    console.log(error);
    res.status(400).send({ status: "failed", message: "Failed to get data" });
  }
});
router.get("/question/:_id", async (req, res) => {
  const { _id } = req.params;

  try {
    const quesInfo = await Question.findById(_id);
    if (quesInfo) {
      res.send({ status: "success", data: quesInfo });
    } else res.send({ status: "failed", data: null });
  } catch (error) {
    console.log(error);
    res.status(400).send({ status: "failed", message: "Failed to get data" });
  }
});
router.delete("/delquestion/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const question = await Question.findByIdAndDelete(id);
    if (question)
      res.status(200).send({ status: true, message: `Question deleted` });
    else
      res.status(404).send({
        status: false,
        message: "Failed to delete question--No Question found",
      });
  } catch (error) {
    console.log(error);
    res
      .status(404)
      .send({ status: false, message: "Failed to delete question" });
  }
});
router.patch("/updateTopic", async (req, res) => {
  const { starttime, endtime, duration, questype, _id } = req.body;

  const newData = {};

  if (starttime) newData["starttime"] = starttime;
  if (endtime) newData["endtime"] = endtime;
  if (questype) newData["questype"] = questype;
  if (duration) newData["duration"] = duration;

  try {
    let updateExam = await Exam.findOneAndUpdate({ _id }, newData, {
      new: true,
    });
    if (updateExam) {
      res
        .status(200)
        .send({ status: true, message: "updated", data: updateExam });
    } else res.status(404).send({ status: false, message: "Failed to update" });
  } catch (error) {
    console.log(error);
    res.status(404).send({ status: false, message: "Failed to update" });
  }
});
router.put("/setQ/:id/", async (req, res) => {
  const { id } = req.params;
  const { questionIds } = req.body;

  const updatedList = await Exam.findByIdAndUpdate(
    id,
    { $push: { questionsList: { $each: questionIds } } },
    { new: true }
  );

  res.send({ status: "success", data: updatedList });
});
module.exports = router;
