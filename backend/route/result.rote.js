const express = require("express");
const { getResults } = require("../controller/result.controller.js");

const router = express.Router();

router.get("/", getResults);
module.exports = router;
