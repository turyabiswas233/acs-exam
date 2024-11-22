const express = require("express");
const SubmitExam = require("../../model/submitExam.model");
const AdminUser = require("../../model/adminUser.model");
const { Exam } = require("../../model/exam.model");
const User = require("../../model/user.model");

const router = express.Router();

router.get("/exams", async (req, res) => {
  const uid = req.headers.authorization.split(" ")[1];

  const adminUser = await AdminUser.findOne().where({
    uid: uid,
  });

  if (!adminUser) {
    res.status(203).json({
      status: false,
      message: "Unauthorized access. No Admin user found",
    });
  } else if (adminUser.permission === false) {
    res.status(201).json({ status: false, message: "Unauthorized access" });
  } else
    try {
      const examInfo = await Exam.find().select(["examname", "examclass"]);

      if (examInfo) {
        res.status(200).send({ status: true, list: examInfo });
        console.log("called");
      } else res.status(203).send({ status: false, list: null });
    } catch (error) {
      console.error("Error verifying token or creating user:", error);
      res.status(404).send({ status: false, message: "Failed to get list" });
    }
});

router.get("/", async (req, res) => {
  const uid = req.headers.authorization.split(" ")[1];
  const { limit, examId,page } = req.query;
  console.log(limit, examId);

  const adminUser = await AdminUser.findOne().where({
    uid: uid,
  });

  if (!adminUser) {
    res.status(203).json({
      status: false,
      message: "Unauthorized access. No Admin user found",
    });
  } else if (adminUser.permission === false) {
    res.status(201).json({ status: false, message: "Unauthorized access" });
  } else
    try {
      const examInfo = await SubmitExam.find()
        .limit(limit)
        .skip((page - 1) * limit)
        .where({ examId: examId });
      console.log(examInfo);
      const data = await Promise.all(
        examInfo?.map(async (e) => {
          return {
            user: await User.findById(e?.userId)?.select(["displayName"]),
            exam: await Exam.findById(e?.examId)?.populate("questionsList"),
            submitInfo: e.submitData,
          };
        })
      );

      if (examInfo) {
        res.status(200).send({ status: true, list: data });
        console.log("called");
      } else res.status(203).send({ status: false, list: null });
    } catch (error) {
      console.error("Error verifying token or creating user:", error);
      res.status(404).send({ status: false, message: "Failed to get list" });
    }
});

module.exports = router;
