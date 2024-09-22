const express = require("express");
const AdminUser = require("../../model/adminUser.model");
const User = require("../../model/user.model");
const { Exam } = require("../../model/exam.model");
const router = express.Router();

router.get("/all", async (req, res) => {
  try {
    const examCount = await Exam.countDocuments();
    const studentCount = await User.countDocuments();
    const teacherCount = await AdminUser.countDocuments().where({
      role: "teacher",
    });

    const list = [
      {
        title: "exam overview",
        type: "exams",
        total: examCount,
      },
      {
        title: "teachers summary",
        type: "teachers",
        total: teacherCount,
      },
      {
        title: "students summary",
        type: "students",
        total: studentCount,
      },
    ];

    res.send({ status: "success", data: [...list] });
  } catch (error) {
    console.log(error);
    res.send({ status: "failed", data: [] });
  }
});

module.exports = router;
