const ReportData = require("../model/report.model.js");

const requestCount = async (req, res) => {
  try {
    const { id } = req.query;
    const { requestCount } = req.body;
    if (requestCount == 1) {
      const updateReport = await ReportData.findByIdAndUpdate(id, {
        requestCount: 2,
      });

      if (updateReport) res.status(200).json({ ok: true, status: 200 });
      else res.status(400).json({ ok: false, status: 400 });
    } else res.status(400).json({ ok: false, status: 400 });
  } catch (err) {
    res.status(400).json({ ok: false, status: 400 });
  }
};
const replyReport = async (req, res) => {
  try {
    const { id } = req.query;
    const data = req.body;
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      res
        .status(400)
        .json({ ok: false, status: 400, message: "Authorization Failed" });
    }
    const UID = token;

    if (UID) {
      const updateReport = await ReportData.findByIdAndUpdate(id, {
        ...data,
        updatedAt: Date.now(),
      });

      if (updateReport) res.status(200).json({ ok: true, status: 200 });
      else res.status(400).json({ ok: false, status: 400 });
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({ ok: false, status: 500 });
  }
};

const getReportList = async (req, res) => {
  const { filterBy } = req.query;
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token || token?.length < 10) {
      res
        .status(400)
        .json({ ok: false, status: 400, message: "Authorization Failed" });
    }

    if (UID) {
      const reports = await ReportData.find()
        .where({ category: filterBy })
        .limit(10)
        .select([
          "problemList",
          "obtainMark",
          "updatedMark",
          "category",
          "studentInfo",
          "reportBy",
          "createdAt",
          "updatedAt",
        ]);

      if (reports) {
        res.status(200).json({ ok: true, data: reports, status: 200 });
      } else {
        res.status(400).json({ ok: false, status: 400 });
      }
    } else {
      res.status(400).json({
        ok: false,
        status: 400,
        message: "Authorization Failed",
      });
    }
  } catch (error) {
    console.log("Error: " + error);
    res.status(404).json({ ok: false, status: 500 });
  }
};
const getReportByUser = async (req, res) => {
  const id = req.query.id;
  console.log("called me", id);

  try {
    const reports = await ReportData.find({
      userId: id,
    })
      .limit(10)
      .select([
        "problemList",
        "category",
        "studentInfo",
        "obtainMark",
        "updatedMark",
        "requestCount",
        "updatedAt",
      ]);

    if (reports) {
      res.status(200).json({ ok: true, data: reports, status: 200 });
    } else {
      res.status(400).json({ ok: false, status: 400 });
    }
  } catch (error) {
    console.log("Error: " + error);
    res.status(404).json({ ok: false, status: 500 });
  }
};
const uploadReport = async (req, res) => {
  const data = req.body;

  // return;
  try {
    const reports = await ReportData.create(data);
    if (reports) {
      res.status(201).json({ ok: true, status: 201 });
    } else {
      res.status(401).json({ ok: false, status: 401 });
    }
  } catch (error) {
    console.log("Error: " + error);
    res.status(501).json({ ok: false, status: 501 });
  }
};

module.exports = {
  uploadReport,
  getReportList,
  getReportByUser,
  replyReport,
  requestCount,
};
