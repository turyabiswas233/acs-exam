const express = require("express");
const {
  getpublicuniversity,
} = require("../controller/publicuniversity.controller.js");

const router = express.Router();

router.get("/", getpublicuniversity);

module.exports = router;
