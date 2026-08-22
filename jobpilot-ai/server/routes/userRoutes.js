const express = require("express");

const {
  getProfile,
  updateProfile,
} = require("../controllers/userController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// GET current user profile
router.get("/profile", protect, getProfile);

// UPDATE current user profile
router.put("/profile", protect, updateProfile);

module.exports = router;