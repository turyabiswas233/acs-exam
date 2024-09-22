const express = require("express");
const { getAdmitCards } = require("../controller/admitCard.controller.js");

const router = express.Router();

router.get("/", getAdmitCards);

module.exports = router;
