const mongoose = require("mongoose");

const reportData = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  studentInfo: {
    fullname: {
      type: mongoose.Schema.Types.String,
      required: true,
    },
    examId: {
      type: mongoose.Schema.Types.String,
      required: true,
    },
    roll: {
      type: mongoose.Schema.Types.String,
      required: true,
    },
    branch: {
      type: mongoose.Schema.Types.String,
      required: true,
    },
  },

  category: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  obtainMark: {
    type: mongoose.Schema.Types.Number,
    required: true,
  },
  requestCount: {
    type: mongoose.Schema.Types.Number,
  },
  updatedMark: {
    type: mongoose.Schema.Types.Number,
  },

  problemList: {
    type: [Object],
    default: [],
  },
  reportBy: {
    type: mongoose.Schema.Types.String,
    required: false,
  },

  createdAt: { type: mongoose.Schema.Types.Date },
  updatedAt: { type: mongoose.Schema.Types.Date, default: Date.now() },
});

const ReportData = mongoose.model("ReportData", reportData);

module.exports = ReportData;
