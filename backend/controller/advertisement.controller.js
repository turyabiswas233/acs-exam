const Advertisement = require("../model/adevertisement.model.js");

const getAdvertisements = async (req, res) => {
  try {
    const advertisements = await Advertisement.find();
    res.status(200).json(advertisements);
  } catch (error) {
    console.error("Error fetching advertisements:", error);
    res.status(404).json({ error: "Server error" });
  }
};

module.exports = { getAdvertisements };
