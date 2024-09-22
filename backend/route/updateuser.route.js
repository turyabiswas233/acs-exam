const express = require("express");

const User = require("../model/user.model.js");

const updateUser = express.Router();
const updateHSC = express.Router();
const updateSSC = express.Router();

updateUser.patch("/profile/:id", async (req, res) => {
  try {
    const { displayName, phone } = req.body;
    const _id = req.params.id;
    let userRes = await User.findByIdAndUpdate(
      _id,
      {
        $set: { displayName, phone },
      },
      { new: true }
    );
    if (userRes) {
      res.status(200).send({ message: "Update Successful", data: userRes });
    } else res.status(404).send("User not found and not updated anything.");
  } catch (error) {
    console.error("Error updating user data:", error);
    res.status(404).json({ error: "Server error" });
  }
});
updateHSC.patch("/hsc/:id", async (req, res) => {
  try {
    const { hsc } = req.body;
    const _id = req.params.id;
    let userRes = await User.findByIdAndUpdate(
      _id,
      {
        $set: { hsc },
      },
      { new: true }
    );
    if (userRes) {
      res.status(200).send({ message: "Update HSC Successful", data: userRes });
    } else res.status(404).send("User not found and not updated anything.");
  } catch (error) {
    console.error("Error updating user data:", error);
    res.status(404).json({ error: "Server error" });
  }
});
updateSSC.patch("/ssc/:id", async (req, res) => {
  try {
    const { ssc } = req.body;
    const _id = req.params.id;
    let userRes = await User.findByIdAndUpdate(
      _id,
      {
        $set: { ssc },
      },
      { new: true }
    );
    if (userRes) {
      res.status(200).send({ message: "Update SSC Successful", data: userRes });
    } else res.status(404).send("User not found and not updated anything.");
  } catch (error) {
    console.error("Error updating user data:", error);
    res.status(404).json({ error: "Server error" });
  }
});

module.exports = { updateUser, updateHSC, updateSSC };
