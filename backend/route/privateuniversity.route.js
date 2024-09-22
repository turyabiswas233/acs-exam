const express = require("express");
const {
  getprivateuniversity,
} = require("../controller/privateuniversity.controller.js");

const router = express.Router();

router.get("/", getprivateuniversity);

module.exports =  router;
