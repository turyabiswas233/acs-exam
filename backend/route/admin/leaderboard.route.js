const express = require("express");
const SubmitExam = require("../../model/submitExam.model");
const AdminUser = require("../../model/adminUser.model");

const router = express.Router();

router.get("/", async (req, res) => {
  const uid = req.headers.authorization.split(" ")[1];
  const { limit, shortType } = req.query;
  console.log(limit, shortType);

  const adminUser = await AdminUser.findOne().where({
    uid: uid,
  });

  if (!adminUser) {
    res.status(401).json({ status: false, message: "Unauthorized access" });
  } else if (adminUser.permission === false) {
    res.status(401).json({ status: false, message: "Unauthorized access" });
  } else
    try {
      const leaderboard = await SubmitExam.find();

      if (leaderboard.length >= 0) {
        res.status(201).json({ status: true, list: leaderboard });
      } else res.status(404).json({ status: false, message: "No data" });
    } catch (error) {
      console.error("Error verifying token or creating user:", error);
      res.status(404).send({ status: false, message: "Failed to get list" });
    }
});

module.exports = router;
