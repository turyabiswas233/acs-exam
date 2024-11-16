const express = require("express");
const multer = require("multer");
const router = express.Router();
const ImageModel = require("../../model/image.model");
// Multer storage configuration

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 3 * 1024 * 1024,
  },
});

router.post("/upload", upload.single("photo"), async (req, res) => {
  try {
    console.log(req.file);
    const image = await ImageModel.create({
      name: req.file.originalname,
      path: req.file.path,
    });
    if (image) {
      console.log("Image uploaded successfully", image);
      res.json({
        message: "Image uploaded successfully",
        imageUrl: req.file.path,
        ...image,
      });
    } else {
      res.status(500).json({ error: "Error uploading image" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error uploading image" });
  }
});

router.get("/get/:id", async (req, res) => {
  try {
    const images = await ImageModel.findById(req.params.id);
    if (images) {
      res.status(200).json(images);
    } else {
      res.status(400).json({ error: "Error getting images" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error getting images" });
  }
});
module.exports = router;
