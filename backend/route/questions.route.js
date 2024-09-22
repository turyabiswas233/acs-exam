const express = require("express");
const Question = require("../model/questions.model.js");

const router = express.Router();
// Get all questions or filter by subject and chapter
router.get("/", async (req, res) => {
  try {
    const { subject, chapter, limit, level, category } = req.query;
    let filter = {};

    if (subject) {
      filter.Subject = subject;
    }

    if (chapter) {
      filter.Chapter = chapter;
    }
    if (level) {
      filter.Level = level;
    }
    if (category) {
      filter.Category = category;
    }
    const SIZE = limit;
    // Category	Subject	Chapter	Type	Board	Dsa	Question	Question_img	Answer	Answer_img	Solution	Solution_Img	Options
    const questions = await Question.aggregate([
      {
        $match: {
          Chapter: filter?.Chapter,
          Type: filter?.Level,
          Category: filter?.Category,
          Subject: filter?.Subject,
        },
      },
      {
        $sample: {
          size: Number(SIZE),
        },
      },
    ]);
    // console.log(filter);
    if (questions?.length > 0) {
      res.status(201).json({
        data: questions?.filter((o) => o.Options?.length > 20),
        message: "question fetched successfully",
      });
    } else {
      res.status(203).json({ data: [], message: "No question found" });
      console.log("partial failed/success");
    }
  } catch (err) {
    res.status(404).json({ message: err.message });
    console.log(err);
  }
});

// Submit an answer
router.post("/answer", async (req, res) => {
  const { questionId, selectedOption } = req.body;
  try {
    const question = await Question.findById(questionId);
    if (question) {
      const isCorrect = question.Answer === selectedOption;
      res.json({ isCorrect });
    } else {
      res.status(404).json({ error: "Question not found" });
    }
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

// Create  new question
router.post("/", async (req, res) => {
  const { question, optionsList, answer, subject, chapter } = req.body;
  const newQuestion = new Question({
    question,
    answer,
    subject,
    chapter,
    optionsList: optionsList?.map((option) => ({ text: option, imageUrl: "" })),
  });
  try {
    const savedQuestion = await newQuestion.save();
    res
      .status(201)
      .json({ message: "data uploaded successfully", data: savedQuestion });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
