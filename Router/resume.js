const express = require("express");
const router = express.Router();
const { upload, uploadFile } = require("../controller/resume");
const { ResumeSchema } = require("../schema/resumeSchema")
router.post("/upload", upload.single("file"), uploadFile);
module.exports = router;