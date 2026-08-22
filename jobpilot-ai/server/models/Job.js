const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    company: {
      type: String,
      required: true,
      trim: true,
    },

    role: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["Applied", "Interview", "Rejected", "Offer"],
      default: "Applied",
    },

    appliedDate: {
      type: Date,
      default: Date.now,
    },

    jobDescription: {
      type: String,
    },

    notes: {
      type: String,
    },
     interviewDate: {
      type: Date,
      default: null,
    },

    interviewTime: {
      type: String,
      default: "",
    },

    interviewLocation: {
      type: String,
      default: "",
    },

    interviewLink: {
      type: String,
      default: "",
    },

    interviewNotes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Job", jobSchema);