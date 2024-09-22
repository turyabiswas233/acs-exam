const AdmitCard = require("../model/admitcard.model.js");

const getAdmitCards = async (req, res) => {
  try {
    const admitCards = await AdmitCard.find();
    res.status(200).json(admitCards);
  } catch (error) {
    console.error("Error fetching admit cards:", error);
    res.status(404).json({ error: "Server error" });
  }
};

module.exports = { getAdmitCards };
