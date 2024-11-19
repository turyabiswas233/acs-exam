const express = require("express");

const User = require("../model/user.model.js");

const authRouter = express.Router();
authRouter.post("/", async (req, res) => {
  const { uid, email, displayName, phone, hsc, ssc } = req.body;

  if (!uid) {
    return res.status(400).send({ message: "UID is required" });
  }

  try {
    let user = await User.findOne({ uid });
    if (user) {
      // console.log("User found in " + user._id);
      res.status(201).send({ message: "old", user });
    } else {
      user = await User.create({
        uid: uid,
        email: email,
        displayName: displayName,
        phone: phone || "no number",
        hsc: hsc,
        ssc: ssc,
      });

      res.status(200).send({ message: "User is successfully created.", user });
      // console.log(`User ${user.email} is new`);
    }
  } catch (error) {
    console.error("Error verifying token or creating user:", error);
    res.status(404).send({ message: "Internal Server Error" });
  }
});

module.exports = authRouter;
