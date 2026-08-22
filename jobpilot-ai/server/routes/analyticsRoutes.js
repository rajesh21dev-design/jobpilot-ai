const express = require("express");
const router = express.Router();

const {
  getAnalytics,
} = require("../controllers/analyticsController");

const protect = require("../middleware/authMiddleware");

// GET /api/analytics
router.get("/", protect, getAnalytics);

module.exports = router;