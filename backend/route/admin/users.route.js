const express = require("express");
const AdminUser = require("../../model/adminUser.model.js");
const User = require("../../model/user.model.js");

const adminUsersRoute = express.Router();

adminUsersRoute.get("/users", async (req, res) => {
  try {
    const { permission, limit, page } = req.query;

    if (!permission) {
      throw new Error({ success: false, message: "Permission Denied" });
    }
    const response = await AdminUser.find()
      .sort({ _id: -1 })
      .limit(limit)
      .skip((page - 1) * limit);
    res.status(200).json({
      success: true,
      message: "Got List of Admin Users",
      list: response,
      size: response.length,
    });
  } catch (error) {
    res
      .status(404)
      .json({ success: false, message: "Permission Denied", error: error });
  }
});
adminUsersRoute.get("/students", async (req, res) => {
  try {
    const { permission, limit, page } = req.query;
    const token = req.headers.authorization.split(" ")[1];

    if (!token || !permission)
      throw new Error({ success: false, message: "Permission Denied" });
    else {
      const UID = token;
      if (UID) {
        const response = await User.find()
          .sort({ _id: -1 })
          .limit(limit)
          .skip((page - 1) * limit);
        if (response) {
          res.status(200).json({
            success: true,
            message: "Got List of Student Users",
            list: response,
            size: response.length,
          });
        } else
          throw new Error({ success: false, message: "Permission Denied" });
      } else throw new Error({ success: false, message: "Permission Denied" });
    }
  } catch (error) {
    res
      .status(404)
      .json({ success: false, message: "Permission Denied", error: error });
  }
});

adminUsersRoute.patch("/users/:id", async (req, res) => {
  try {
    const { permission } = req.body;
    const _id = req.params.id;
    const adminUser = await AdminUser.findByIdAndUpdate(_id, {
      $set: { permission: permission },
    });
    if (adminUser)
      res
        .status(200)
        .json({ success: true, message: "Update Successful", _id: _id });
    else res.status(404).json({ success: false, message: "Update Failed" });
  } catch (error) {
    console.log(error);
    res
      .status(404)
      .json({ success: false, message: "Error 500: To change permission" });
  }
});

module.exports = adminUsersRoute;
