const express = require("express");
const Leaderboard = require("../model/leaderboard.model.js");

const router = express.Router();
router.post("/", async (req, res) => {
  const {
    userID,
    username,
    examname,
    subject,
    chapter,
    examtype,
    classtype,
    correct,
    inCorrect,
    total,
  } = req.body;

  if (!userID) {
    return res.status(400).send({ status: false, message: "UID is required" });
  }
  let leaderboard = null;
  try {
    leaderboard = await Leaderboard.findOne({ userID, examname });
    if (leaderboard) {
      res.status(201).json({
        status: true,
        message: "Already submitted",
        data: leaderboard,
      });
    } else {
      leaderboard = new Leaderboard({
        userID,
        username,
        examname,
        subject,
        chapter,
        examtype,
        classtype,
        correct,
        inCorrect,
        total,
      });
      await leaderboard.save();
      res.status(200).json({
        status: true,
        message: "Successfully Finished the exam",
        data: leaderboard,
      });
    }
  } catch (error) {
    console.error("Error verifying token or creating user:", error);
    res.status(404).send({ status: false, message: "Failed to submit exam" });
  }
});

router.get("/", async (req, res) => {
  const { examtype } = req.query;

  let leaderboard = null;

  try {
    leaderboard = await Leaderboard.find({ examtype });
    if (leaderboard) {
      res.status(201).json({ status: true, list: leaderboard });
    }
  } catch (error) {
    console.error("Error verifying token or creating user:", error);
    res.status(404).send({ status: false, message: "Failed to submit exam" });
  }
});

module.exports = router;
