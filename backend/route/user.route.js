const express = require("express");

const User = require("../model/user.model.js");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { uid } = req.query;
    let user = await User.findOne({
      uid: uid,
    });

    if (user) {
      // console.log(user);
      res.status(200).json({ message: "old_user", user: user });
    } else res.status(201).json({ message: "new_user" });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(404).json({ error: "Server error" });
  }
});

module.exports = router;
