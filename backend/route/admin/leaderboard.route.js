const express = require("express");
const Leaderboard = require("../../model/leaderboard.model.js");

const router = express.Router();

router.get("/", async (req, res) => {
  let leaderboard = null;

  try {
    leaderboard = await Leaderboard.find();
    if (leaderboard) {
      res.status(201).json({ status: true, list: leaderboard });
    }
  } catch (error) {
    console.error("Error verifying token or creating user:", error);
    res.status(404).send({ status: false, message: "Failed to submit exam" });
  }
});

module.exports = router;
