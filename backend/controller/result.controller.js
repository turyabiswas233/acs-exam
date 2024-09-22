const Result = require("../model/result.model.js");

const getResults = async (req, res) => {
  try {
    const results = await Result.find();
    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching results:", error);
    res.status(404).json({ error: "Server error" });
  }
};
module.exports = { getResults };
