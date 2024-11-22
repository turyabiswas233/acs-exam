const express = require("express");
const AdminUser = require("../../model/adminUser.model.js");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const tokenId = req.headers.authorization.split(" ")[1];
    if (!tokenId) {
      res.status(204).json({ error: "no tokenid found", status: "failed" });
      return;
    }

    let user = await AdminUser.findOne({
      uid: tokenId,
    });

    if (user) {
      console.log("user found");
      res.status(200).json({ message: "user found", user: user });
    } else {
      console.log("No user found for this token");
      res.status(201).json({ message: "no user", user: null });
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(404).json({ message: "Server error" });
  }
});

module.exports = router;
