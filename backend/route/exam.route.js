const express = require("express");
const { Exam } = require("../model/exam.model.js");

const router = express.Router();

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

module.exports = router;
