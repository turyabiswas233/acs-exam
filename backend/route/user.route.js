const express = require("express");

const User = require("../model/user.model.js");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { uid, displayName, phone } = req.body;

    const finduser = await User.findOne().where({
      displayName: displayName,
      phone: phone?.replace("+88", ""),
    });
    console.log("post", uid, finduser);
    if (finduser) {
      return res.status(200).json({ status: true, user: finduser });
    } else {
      const newUser = await User.create({
        uid: uid,
        displayName: displayName,
        phone: phone.replace("+88", ""),
        createdAt: new Date(),
      });
      console.log(newUser);
      if (newUser) return res.status(200).json({ status: true, user: newUser });
      return res.status(201).json({ status: false, user: null });
    }
  } catch (error) {
    console.error("Error fetching user data:", error); // kire, vul ta kothay :)
    res.status(404).json({ error: "Server error" });
  }
});
router.get("/", async (req, res) => {
  const uid = req.headers.authorization.split(" ")[1];
  if (!uid) return res.status(204).json({ message: "No user found" });
  try {
    const user = await User.findOne({
      uid: uid,
    });

    if (user) {
      res.status(200).json({ message: "user found", user: user });
    } else res.status(201).json({ message: "No user found" });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(404).json({ message: "Server error" });
  }
});

module.exports = router;
