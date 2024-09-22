const mongoose = require("mongoose");

const advertisementSchema = mongoose.Schema({
  id: Number,
  name: String,
  title: String,
  price: Number,
  category: String,
  video: String,
  link: String,
});

const Advertisement = mongoose.model("Advertisement", advertisementSchema);

module.exports = Advertisement;
