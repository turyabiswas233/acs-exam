const Apply = require("../model/apply.model.js");

const getApply = async (req, res) => {
  try {
    const applications = await Apply.find();
    res.status(200).json(applications);
  } catch (error) {
    console.log("Error: " + error);
    res.status(404).json({ error: "Server error" });
  }
};
module.exports = { getApply };
