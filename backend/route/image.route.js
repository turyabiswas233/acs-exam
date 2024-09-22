const e = require("express");
const Image = require("../model/image.model.js");
const router = e.Router();

// reality routes comes here!!
router.post("/upload", async (req, res) => {
  const { base64 } = req.body;
  console.log("uploading...");
  // return;
  try {
    const image = await Image.create({ image: base64 });
    console.log(image);
    if (image) res.send({ status: "success", data: image });
    else res.status(401).send({ status: "failed" });
  } catch (err) {
    console.log("image route", err);
    res.status(401).send({ status: "failed" });
  }
});
router.get("/", async (req, res) => {
  try {
    const images = await Image.find();
    if (images.length > 0) res.send({ status: "success", data: images });
    else res.status(401).send({ status: "failed" });
  } catch (err) {
    console.log("image route", err);
    res.status(401).send({ status: "failed" });
  }
});
module.exports = router;
