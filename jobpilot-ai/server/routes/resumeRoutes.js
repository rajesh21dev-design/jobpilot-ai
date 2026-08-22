const express = require("express");

const router = express.Router();

const {
  createResumeAnalysis,
  analyzeResume,
  getResumes,
  getResumeById,
  deleteResume,
  matchResumeWithJob,
  improveResume,
  downloadImprovedResume,
} = require("../controllers/resumeController");

const protect = require("../middleware/authMiddleware");

const upload = require("../middleware/uploadMiddleware");

// =========================
// ANALYZE RESUME PDF
// =========================
router.post(
  "/analyze",
  protect,
  upload.single("resume"),
  analyzeResume
);

// =========================
// CREATE RESUME ANALYSIS
// =========================
router.post("/", protect, createResumeAnalysis);

// =========================
// JOB DESCRIPTION MATCHER
// IMPORTANT: Must be before "/:id"
// =========================
router.post(
  "/job-match",
  protect,
  matchResumeWithJob
);


router.post(
  "/improve",
  protect,
  improveResume
);

router.get(
  "/:resumeId/download",
  protect,
  downloadImprovedResume
);

// =========================
// GET ALL RESUMES
// =========================
router.get("/", protect, getResumes);

// =========================
// GET ONE RESUME
// =========================
router.get("/:id", protect, getResumeById);

// =========================
// DELETE RESUME
// =========================
router.delete("/:id", protect, deleteResume);

module.exports = router;