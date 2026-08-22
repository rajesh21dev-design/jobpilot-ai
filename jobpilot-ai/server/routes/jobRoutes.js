const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
} = require("../controllers/jobController");

// Create a job application
router.post("/", protect, createJob);

// Get all jobs for logged-in user
router.get("/", protect, getJobs);

// Get jobs by id for logged-in user
router.get("/:id", protect,  getJobById);

// Update a job application
router.put("/:id", protect, updateJob);

// Delete a job application
router.delete("/:id", protect, deleteJob);

module.exports = router;