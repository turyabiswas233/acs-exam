const express = require("express");
const { getApply } = require("../controller/apply.controller.js");

const router = express.Router();

router.get("/", getApply);

module.exports = router;
