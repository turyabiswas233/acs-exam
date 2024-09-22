const express = require("express");

const router = express.Router();

router.post("/", async (req, res) => {
  const { role } = req.body;
  try {
    if (role === "ADMIN_ROOT")
      res.status(200).json({ role: process.env.ADMIN_ROOT });
    else if (role === "ADMIN_TEACHER")
      res.status(200).json({ role: process.env.ADMIN_TEACHER });
    else res.status(400).json({ role: "null" });
  } catch (error) {
    res.status(404).json({ message: "Internal server error", success: false });
  }
});
module.exports = router;
