const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    // =========================
    // USER
    // =========================
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // =========================
    // FILE INFORMATION
    // =========================
    fileName: {
      type: String,
      required: true,
    },

    fileUrl: {
      type: String,
      default: "",
    },

    // =========================
    // ORIGINAL RESUME CONTENT
    // =========================
    resumeText: {
      type: String,
      default: "",
    },

    // =========================
    // SCORES
    // =========================
    score: {
      type: Number,
      default: 0,
    },

    atsScore: {
      type: Number,
      default: 0,
    },

    skillsScore: {
      type: Number,
      default: 0,
    },

    experienceScore: {
      type: Number,
      default: 0,
    },

    formatScore: {
      type: Number,
      default: 0,
    },

    // =========================
    // ANALYSIS DATA
    // =========================
    summary: {
      type: String,
      default: "",
    },

    strengths: {
      type: [String],
      default: [],
    },

    improvements: {
      type: [String],
      default: [],
    },

    skills: {
      type: [String],
      default: [],
    },

    missingSkills: {
      type: [String],
      default: [],
    },

    suggestions: {
      type: [String],
      default: [],
    },

    // =========================
    // AI GENERATED IMPROVEMENTS
    // =========================
    aiImprovements: [
      {
        type: {
          type: String,
          default: "",
        },

        title: {
          type: String,
          default: "",
        },

        original: {
          type: String,
          default: "",
        },

        improved: {
          type: String,
          default: "",
        },

        tips: {
          type: [String],
          default: [],
        },

        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Resume",
  resumeSchema
);