const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  uid: { type: mongoose.Schema.Types.String, required: true, unique: true },
  // email: { type: mongoose.Schema.Types.String, required: true, unique: true },
  displayName: {
    type: mongoose.Schema.Types.String,
    required: true,
    unique: true,
  },
  phone: { type: mongoose.Schema.Types.String, require: true, unique: true },
  // hsc: { type: Object },
  // ssc: { type: Object },
  createdAt: { type: mongoose.Schema.Types.Date, default: new Date() },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
