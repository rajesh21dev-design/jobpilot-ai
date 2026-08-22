const Job = require("../models/Job");

// ==========================================
// GET ANALYTICS DATA
// GET /api/analytics
// Private
// ==========================================
const getAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;

    // ==========================================
    // STATUS COUNTS
    // ==========================================
    const statusStats = await Job.aggregate([
      {
        $match: {
          user: req.user._id,
        },
      },
      {
        $group: {
          _id: "$status",
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    // Default values
    const stats = {
      total: 0,
      applied: 0,
      interview: 0,
      offer: 0,
      rejected: 0,
    };

    // Convert aggregation result
    statusStats.forEach((item) => {
      const status = item._id?.toLowerCase();

      if (status === "applied") {
        stats.applied = item.count;
      }

      if (status === "interview") {
        stats.interview = item.count;
      }

      if (status === "offer") {
        stats.offer = item.count;
      }

      if (status === "rejected") {
        stats.rejected = item.count;
      }

      stats.total += item.count;
    });

    // ==========================================
    // RECENT APPLICATIONS
    // ==========================================
    const recentApplications = await Job.find({
      user: userId,
    })
      .sort({
        createdAt: -1,
      })
      .limit(5)
      .select(
        "company role status createdAt appliedDate"
      );

    // ==========================================
    // MONTHLY APPLICATION ACTIVITY
    // ==========================================
    const monthlyActivity = await Job.aggregate([
      {
        $match: {
          user: req.user._id,
        },
      },
      {
        $group: {
          _id: {
            year: {
              $year: "$createdAt",
            },
            month: {
              $month: "$createdAt",
            },
          },
          applications: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);

    res.status(200).json({
      message: "Analytics data fetched successfully",
      stats,
      recentApplications,
      monthlyActivity,
    });
  } catch (error) {
    console.error("Analytics Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getAnalytics,
};