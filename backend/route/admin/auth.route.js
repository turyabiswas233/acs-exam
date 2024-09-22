const express = require("express");

const AdminUser = require("../../model/adminUser.model.js");

const router = express.Router();
router.post("/", async (req, res) => {
  const { uid, email, displayName, phone, role } = req.body;

  if (!uid) {
    return res.status(400).send({ message: "UID is required", success: false });
  }

  try {
    let user = await AdminUser.findOne({ uid });
    if (user) {
      // console.log("Admin User found in " + user._id);
      res
        .status(404)
        .json({ message: "account with this email found", success: false });
    } else {
      user = new AdminUser({
        uid: uid,
        email: email,
        displayName: displayName,
        phone: phone,
        role: role,
        permission: false,
      });
      await user.save();
      res.status(200).send({
        message: "User is successfully created.",
        user: user,
        success: true,
      });
      console.log("success");
    }
  } catch (error) {
    console.error("Error verifying token or creating user:", error);
    res.status(404).send({ message: "Internal Server Error", success: false });
  }
});

module.exports = router;
