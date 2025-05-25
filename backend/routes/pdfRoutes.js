const express = require("express");
const { uploadPDF, getUserPDFs, sharePDF, getSharedPDF, deletePDF, renamePDF } = require("../controllers/pdfController");
const upload = require("../middleware/uploadMiddleware");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/upload", authMiddleware, upload.single("pdf"), uploadPDF);
router.get("/", authMiddleware, getUserPDFs);
router.post("/share", authMiddleware, sharePDF);
router.get("/shared/:link", getSharedPDF);
router.delete("/:pdfId", authMiddleware, deletePDF);
router.put("/:pdfId/rename", authMiddleware, renamePDF);

module.exports = router;
