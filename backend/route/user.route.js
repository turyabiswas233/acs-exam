const express = require("express");

const User = require("../model/user.model.js");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { uid, displayName, phone } = req.body;
    const finduser = await User.findOne().where({
      displayName: displayName,
      phone: phone,
    });
    console.log(uid, finduser);
    if (finduser) {
      res.status(200).json({ status: true, user: finduser });
      return;
    } else {
      const newUser = await User.create(req.body);
      await newUser.save();
      if (newUser) res.status(201).json({ status: true, user: newUser });
      else res.status(201).json({ status: false, user: null });
      return;
    }
  } catch (error) {
    console.error("Error fetching user data:", error); // kire, vul ta kothay :)
    res.status(404).json({ error: "Server error" });
  }
});
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
