const express = require("express");
const {
  getAdvertisements,
} = require("../controller/advertisement.controller.js");

const router = express.Router();

router.get("/", getAdvertisements);

module.exports = router;
