const PDF = require("../models/PDF");
const crypto = require("crypto");
const { sendShareEmail } = require("../utils/emailService");
const path = require("path");
const fs = require("fs");

exports.uploadPDF = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    // Create file URL for local storage
    const fileUrl = `/uploads/${req.file.filename}`;

    const pdf = new PDF({
      user: req.user.id,
      fileName: req.file.originalname,
      fileUrl: fileUrl,
    });

    await pdf.save();
    console.log("✅ PDF Uploaded & Saved:", pdf);

    res.status(201).json({ message: "PDF uploaded successfully", pdf });
  } catch (error) {
    console.error("❌ Error saving PDF:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

exports.getUserPDFs = async (req, res) => {
  try {
    const pdfs = await PDF.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(pdfs);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

exports.sharePDF = async (req, res) => {
  try {
    const { pdfId, emails } = req.body;
    const pdf = await PDF.findById(pdfId);
    if (!pdf) return res.status(404).json({ message: "PDF not found" });

    if (pdf.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const uniqueLink = `${process.env.CLIENT_URL}/view/${pdfId}-${crypto
      .randomBytes(8)
      .toString("hex")}`;
    pdf.sharedWith.push(...emails);
    pdf.shareableLink = uniqueLink;
    await pdf.save();

    // Send email to each recipient with the PDF name
    emails.forEach((email) => sendShareEmail(email, uniqueLink, pdf.fileName));

    res.json({
      message: "PDF shared successfully and email sent!",
      link: uniqueLink,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

exports.getSharedPDF = async (req, res) => {
  try {
    const { link } = req.params;
    const cleanPdfId = link.split("-")[0];
    const pdf = await PDF.findById(cleanPdfId);

    if (!pdf) {
      return res.status(404).json({ message: "PDF not found" });
    }

    res.json({ pdf });
  } catch (error) {
    console.error("Error fetching shared PDF:", error);
    res.status(500).json({ message: "Server Error", error: error.toString() });
  }
};

// Add a new endpoint to serve PDF files
exports.servePDF = async (req, res) => {
  try {
    const fileName = req.params.filename;
    const filePath = path.join(__dirname, "../uploads", fileName);
    res.sendFile(filePath);
  } catch (error) {
    console.error("❌ Error serving PDF:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

exports.deletePDF = async (req, res) => {
  try {
    const { pdfId } = req.params;
    const pdf = await PDF.findById(pdfId);

    if (!pdf) {
      return res.status(404).json({ message: "PDF not found" });
    }

    // Check if user owns the PDF
    if (pdf.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to delete this PDF" });
    }

    // Delete the file from uploads directory
    const filePath = path.join(__dirname, "..", pdf.fileUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete from database
    await PDF.findByIdAndDelete(pdfId);

    res.json({ message: "PDF deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting PDF:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

exports.renamePDF = async (req, res) => {
  try {
    const { pdfId } = req.params;
    const { newFileName } = req.body;

    if (!newFileName || newFileName.trim() === '') {
      return res.status(400).json({ message: "New file name is required" });
    }

    const pdf = await PDF.findById(pdfId);
    if (!pdf) {
      return res.status(404).json({ message: "PDF not found" });
    }

    // Check if user owns the PDF
    if (pdf.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to rename this PDF" });
    }

    pdf.fileName = newFileName;
    await pdf.save();

    res.json({ message: "PDF renamed successfully", pdf });
  } catch (error) {
    console.error("❌ Error renaming PDF:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};



