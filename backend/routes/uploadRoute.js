// routes/uploadRoute.js
const express = require("express");
const multer = require("multer");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const s3 = require("../s3");
const { v4: uuid } = require("uuid");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1 * 1024 * 1024 }, // 1MB
});

router.post("/upload", (req, res) => {
  upload.single("image")(req, res, async (err) => {
    // ✅ Multer errors (including LIMIT_FILE_SIZE)
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res
          .status(400)
          .json({ success: false, error: "File too large. Max 1MB allowed." });
      }
      return res
        .status(400)
        .json({ success: false, error: `Upload error: ${err.code}` });
    }
    // ✅ Other errors
    if (err) {
      return res
        .status(500)
        .json({ success: false, error: "Unexpected upload error" });
    }

    // ✅ No file present
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, error: "No file uploaded" });
    }

    try {
      const file = req.file;
      const fileKey = `${uuid()}-${file.originalname}`;

      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_BUCKET,
          Key: fileKey,
          Body: file.buffer,
          ContentType: file.mimetype,
        })
      );

      const imageUrl = `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
      return res.json({ success: true, imageUrl });
    } catch (e) {
      console.error("S3 putObject error:", e);
      return res
        .status(500)
        .json({ success: false, error: "Upload failed (S3 error)" });
    }
  });
});

module.exports = router;
