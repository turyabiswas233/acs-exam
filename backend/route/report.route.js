const express = require("express");
const {
  uploadReport,
  replyReport,
  getReportByUser,
  getReportList,
  requestCount,
} = require("../controller/report.controller.js");

const router = express.Router();

router.post("/upload", uploadReport);
router.patch("/reply", replyReport);
router.patch("/request", requestCount);
router.get("/getall", getReportList);
router.get("/get", getReportByUser);

module.exports = router;
