const PublicUniversity = require("../model/publicuniversity.model.js");

const getpublicuniversity = async (req, res) => {
  try {
    const publicUniversities = await PublicUniversity.find();
    res.status(200).json(publicUniversities);
  } catch (error) {
    console.log("Error: " + error);
    res.status(404).json(error);
  }
};

module.exports = { getpublicuniversity };
