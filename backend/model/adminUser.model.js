const mongoose = require("mongoose");

const adminUserSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  displayName: { type: String, required: true },
  role: { type: String, enum: ["sudo-admin", "teacher"], required: true },
  phone: { type: String, required: true },
  permission: { type: Boolean },
  createdAt: { type: Date, default: Date.now },
});

const AdminUser = mongoose.model("AdminUser", adminUserSchema);
module.exports = AdminUser;
