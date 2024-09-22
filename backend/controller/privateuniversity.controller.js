const privateuniversity = require("../model/privateuniversity.model.js");

const getprivateuniversity = async (req, res) => {
  try {
    const PrivateUniversity = await privateuniversity.find();
    res.status(200).json(PrivateUniversity);
  } catch (error) {
    console.log("Error: " + error);
    res.status(404).json(error);
  }
};

module.exports = { getprivateuniversity };
