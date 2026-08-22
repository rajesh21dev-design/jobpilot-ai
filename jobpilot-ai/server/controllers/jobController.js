const Job = require("../models/Job");

// ==========================================
// CREATE JOB APPLICATION
// POST /api/jobs
// Private
// ==========================================
const createJob = async (req, res) => {
  try {
    const {
      company,
      role,
      status,
      appliedDate,
      jobDescription,
      notes,
      interviewDate,
      interviewTime,
      interviewLocation,
      interviewLink,
      interviewNotes,
    } = req.body;

    // Basic validation
    if (!company || !role) {
      return res.status(400).json({
        message: "Company and role are required",
      });
    }

    const job = await Job.create({
      company,
      role,
      status: status || "Applied",
      appliedDate: appliedDate || new Date(),
      jobDescription,
      notes,
      interviewDate: interviewDate || null,
      interviewTime: interviewTime || "",
      interviewLocation: interviewLocation || "",
      interviewLink: interviewLink || "",
      interviewNotes: interviewNotes || "",
      user: req.user.id,
    });

    res.status(201).json({
      message: "Job application created successfully",
      job,
    });
  } catch (error) {
    console.error("Create Job Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ==========================================
// GET ALL JOBS
// GET /api/jobs
// Private
// ==========================================
const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({
      user: req.user.id,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    console.error("Get Jobs Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ==========================================
// GET SINGLE JOB
// GET /api/jobs/:id
// Private
// ==========================================
const getJobById = async (req, res) => {
  try {
    const job = await Job.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    res.status(200).json({
      job,
    });
  } catch (error) {
    console.error("Get Job Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ==========================================
// UPDATE JOB
// PUT /api/jobs/:id
// Private
// ==========================================
const updateJob = async (req, res) => {
  try {
    const {
      company,
      role,
      status,
      appliedDate,
      jobDescription,
      notes,
      interviewDate,
      interviewTime,
      interviewLocation,
      interviewLink,
      interviewNotes,
    } = req.body;

    const job = await Job.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    // Update only provided fields
    if (company !== undefined) {
      job.company = company;
    }

    if (role !== undefined) {
      job.role = role;
    }

    if (status !== undefined) {
      job.status = status;
    }

    if (appliedDate !== undefined) {
      job.appliedDate = appliedDate;
    }

    if (jobDescription !== undefined) {
      job.jobDescription = jobDescription;
    }

    if (notes !== undefined) {
      job.notes = notes;
    }

    // Interview fields
    if (interviewDate !== undefined) {
      job.interviewDate = interviewDate || null;
    }

    if (interviewTime !== undefined) {
      job.interviewTime = interviewTime;
    }

    if (interviewLocation !== undefined) {
      job.interviewLocation = interviewLocation;
    }

    if (interviewLink !== undefined) {
      job.interviewLink = interviewLink;
    }

    if (interviewNotes !== undefined) {
      job.interviewNotes = interviewNotes;
    }

    await job.save();

    res.status(200).json({
      message: "Job application updated successfully",
      job,
    });
  } catch (error) {
    console.error("Update Job Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ==========================================
// DELETE JOB
// DELETE /api/jobs/:id
// Private
// ==========================================
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    res.status(200).json({
      message: "Job application deleted successfully",
    });
  } catch (error) {
    console.error("Delete Job Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
};