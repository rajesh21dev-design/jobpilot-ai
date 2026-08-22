const Resume = require("../models/Resume");
const { PDFParse } = require("pdf-parse");
const PDFDocument = require("pdfkit");

// =====================================================
// CREATE RESUME ANALYSIS
// =====================================================
const createResumeAnalysis = async (req, res) => {
  try {
    const {
      fileName,
      fileUrl,
      atsScore,
      summary,
      skills,
      missingSkills,
      suggestions,
    } = req.body;

    if (!fileName) {
      return res.status(400).json({
        message: "Resume file name is required",
      });
    }

    const resume = await Resume.create({
      user: req.user.id,
      fileName,
      fileUrl: fileUrl || "",
      atsScore: atsScore || 0,
      summary: summary || "",
      skills: skills || [],
      missingSkills: missingSkills || [],
      suggestions: suggestions || [],
      aiImprovements: [],
    });

    res.status(201).json({
      message: "Resume analysis created successfully",
      resume,
    });
  } catch (error) {
    console.error("Create resume error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// =====================================================
// ANALYZE RESUME PDF
// =====================================================
const analyzeResume = async (req, res) => {
  let parser;

  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Please upload a PDF resume",
      });
    }

    parser = new PDFParse({
      data: req.file.buffer,
    });

    const pdfData = await parser.getText();
    const resumeText = pdfData.text || "";

    if (!resumeText.trim()) {
      return res.status(400).json({
        message: "Could not extract text from this PDF",
      });
    }

    const text = resumeText.toLowerCase();

    // =====================================================
    // SKILLS
    // =====================================================
    const skillKeywords = [
      "react",
      "react.js",
      "javascript",
      "typescript",
      "node.js",
      "nodejs",
      "express",
      "express.js",
      "mongodb",
      "mongoose",
      "mysql",
      "postgresql",
      "sql",
      "html",
      "css",
      "tailwind",
      "tailwind css",
      "bootstrap",
      "python",
      "java",
      "c++",
      "c#",
      "php",
      "git",
      "github",
      "docker",
      "kubernetes",
      "aws",
      "azure",
      "google cloud",
      "cloud",
      "rest api",
      "api",
      "redux",
      "redux toolkit",
      "next.js",
      "nextjs",
      "vue",
      "vue.js",
      "angular",
      "firebase",
      "figma",
      "postman",
      "jwt",
      "authentication",
      "responsive design",
    ];

    const skills = [
      ...new Set(
        skillKeywords.filter((skill) => text.includes(skill))
      ),
    ];

    // =====================================================
    // IMPORTANT ATS KEYWORDS
    // =====================================================
    const importantKeywords = [
      "git",
      "github",
      "rest api",
      "typescript",
      "testing",
      "docker",
      "cloud",
      "authentication",
    ];

    const missingKeywords = importantKeywords.filter(
      (keyword) => !text.includes(keyword)
    );

    // =====================================================
    // SECTIONS
    // =====================================================
    const hasSkillsSection =
      text.includes("skills") ||
      text.includes("technical skills") ||
      text.includes("core competencies");

    const hasExperience =
      text.includes("experience") ||
      text.includes("work experience") ||
      text.includes("professional experience") ||
      text.includes("internship") ||
      text.includes("employment");

    const hasProjects =
      text.includes("projects") ||
      text.includes("project experience") ||
      text.includes("academic projects");

    const hasEducation =
      text.includes("education") ||
      text.includes("academic background");

    const hasCertifications =
      text.includes("certification") ||
      text.includes("certifications") ||
      text.includes("certificate");

    // =====================================================
    // CONTACT
    // =====================================================
    const hasEmail =
      /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i.test(
        resumeText
      );

    const hasPhone =
      /(?:\+?\d{1,3}[-.\s]?)?(?:\(?\d{3,5}\)?[-.\s]?)?\d{3,5}[-.\s]?\d{3,5}/.test(
        resumeText
      );

    const hasLinkedIn = text.includes("linkedin");
    const hasGitHub = text.includes("github");

    const hasContact =
      hasEmail ||
      hasPhone ||
      hasLinkedIn ||
      hasGitHub;

    // =====================================================
    // ACTION VERBS
    // =====================================================
    const actionVerbs = [
      "developed",
      "built",
      "created",
      "implemented",
      "designed",
      "improved",
      "optimized",
      "managed",
      "led",
      "collaborated",
      "deployed",
      "integrated",
      "engineered",
      "maintained",
      "automated",
      "tested",
      "analyzed",
      "delivered",
      "achieved",
    ];

    const foundActionVerbs = actionVerbs.filter((verb) =>
      text.includes(verb)
    );

    // =====================================================
    // ACHIEVEMENTS
    // =====================================================
    const percentageMatches =
      resumeText.match(/\d+(?:\.\d+)?%/g) || [];

    const numberMatches =
      resumeText.match(/\b\d+\+?\b/g) || [];

    const achievementCount =
      percentageMatches.length +
      Math.min(numberMatches.length, 10);

    // =====================================================
    // EXPERIENCE SIGNALS
    // =====================================================
    const experienceKeywords = [
      "intern",
      "developer",
      "engineer",
      "software",
      "worked",
      "responsible",
      "role",
      "team",
      "company",
      "organization",
      "client",
    ];

    const foundExperienceKeywords =
      experienceKeywords.filter((keyword) =>
        text.includes(keyword)
      );

    // =====================================================
    // ATS SCORE
    // =====================================================
    let atsScore = 30;

    if (hasSkillsSection) atsScore += 10;
    if (hasExperience) atsScore += 10;
    if (hasProjects) atsScore += 10;
    if (hasEducation) atsScore += 5;
    if (hasContact) atsScore += 5;
    if (hasCertifications) atsScore += 3;

    atsScore += Math.min(skills.length * 2, 12);

    const keywordCoverage =
      importantKeywords.length -
      missingKeywords.length;

    atsScore += Math.min(keywordCoverage * 2, 10);

    atsScore = Math.min(atsScore, 100);

    // =====================================================
    // SKILLS SCORE
    // =====================================================
    let skillsScore = 30;

    skillsScore += Math.min(skills.length * 5, 50);

    if (skills.length >= 10) {
      skillsScore += 10;
    }

    if (skills.length >= 15) {
      skillsScore += 10;
    }

    skillsScore = Math.min(skillsScore, 100);

    // =====================================================
    // EXPERIENCE SCORE
    // =====================================================
    let experienceScore = 20;

    if (hasExperience) experienceScore += 25;
    if (hasProjects) experienceScore += 20;

    experienceScore += Math.min(
      foundActionVerbs.length * 3,
      15
    );

    experienceScore += Math.min(
      achievementCount * 2,
      10
    );

    experienceScore += Math.min(
      foundExperienceKeywords.length * 2,
      10
    );

    experienceScore = Math.min(
      experienceScore,
      100
    );

    // =====================================================
    // FORMAT SCORE
    // =====================================================
    let formatScore = 30;

    if (hasEmail) formatScore += 10;
    if (hasPhone) formatScore += 10;
    if (hasSkillsSection) formatScore += 10;
    if (hasExperience) formatScore += 10;
    if (hasEducation) formatScore += 10;
    if (hasProjects) formatScore += 5;

    if (
      resumeText.length >= 800 &&
      resumeText.length <= 8000
    ) {
      formatScore += 10;
    } else if (resumeText.length >= 500) {
      formatScore += 5;
    }

    formatScore = Math.min(formatScore, 100);

    // =====================================================
    // OVERALL SCORE
    // =====================================================
    const score = Math.round(
      atsScore * 0.3 +
        skillsScore * 0.25 +
        experienceScore * 0.25 +
        formatScore * 0.2
    );

    // =====================================================
    // STRENGTHS
    // =====================================================
    const strengths = [];

    if (skills.length >= 10) {
      strengths.push(
        `Strong technical profile with ${skills.length} detected skills`
      );
    } else if (skills.length >= 5) {
      strengths.push(
        `Good technical profile with ${skills.length} detected skills`
      );
    }

    if (hasProjects) {
      strengths.push(
        "Project experience section detected"
      );
    }

    if (hasExperience) {
      strengths.push(
        "Professional or work experience section detected"
      );
    }

    if (foundActionVerbs.length >= 3) {
      strengths.push(
        "Good use of action-oriented language"
      );
    }

    if (achievementCount >= 3) {
      strengths.push(
        "Resume includes measurable achievements and results"
      );
    }

    if (hasEmail && hasPhone) {
      strengths.push(
        "Complete contact information detected"
      );
    }

    if (hasLinkedIn || hasGitHub) {
      strengths.push(
        "Professional profile links detected"
      );
    }

    if (strengths.length === 0) {
      strengths.push(
        "Resume contains readable content for further improvement"
      );
    }

    // =====================================================
    // IMPROVEMENTS
    // =====================================================
    const improvements = [];

    if (skills.length < 5) {
      improvements.push(
        "Add more relevant technical and job-specific skills"
      );
    }

    if (!hasProjects) {
      improvements.push(
        "Add a dedicated projects section with technologies and outcomes"
      );
    }

    if (!hasExperience) {
      improvements.push(
        "Add clear work, internship, freelance, or practical experience"
      );
    }

    if (foundActionVerbs.length < 3) {
      improvements.push(
        "Use stronger action verbs such as Developed, Built, Implemented, or Optimized"
      );
    }

    if (achievementCount < 3) {
      improvements.push(
        "Add measurable achievements using numbers, percentages, or project impact"
      );
    }

    if (!hasEmail || !hasPhone) {
      improvements.push(
        "Ensure your resume includes complete professional contact information"
      );
    }

    if (missingKeywords.length > 3) {
      improvements.push(
        "Improve ATS keyword coverage with relevant industry and job-description terms"
      );
    }

    const finalImprovements =
      improvements.slice(0, 6);

    const analysis = {
      score,
      atsScore,
      skillsScore,
      experienceScore,
      formatScore,
      strengths,
      improvements: finalImprovements,
      skills,
      missingKeywords,
    };

    // =====================================================
    // SAVE RESUME
    // =====================================================
    const resume = await Resume.create({
      user: req.user.id,
      fileName: req.file.originalname,
      fileUrl: "",
      resumeText,

      score: analysis.score,
      atsScore: analysis.atsScore,
      skillsScore: analysis.skillsScore,
      experienceScore: analysis.experienceScore,
      formatScore: analysis.formatScore,

      summary: `Resume analyzed successfully. Overall score: ${analysis.score}/100`,

      strengths: analysis.strengths,
      improvements: analysis.improvements,
      skills: analysis.skills,
      missingSkills: analysis.missingKeywords,
      suggestions: analysis.improvements,

      aiImprovements: [],
    });

    return res.status(200).json({
      message: "Resume analyzed successfully",
      analysis,
      resume,
    });
  } catch (error) {
    console.error("Resume analysis error:", error);

    return res.status(500).json({
      message:
        error.message || "Failed to analyze resume",
    });
  } finally {
    if (parser) {
      try {
        await parser.destroy();
      } catch (error) {
        console.error(
          "PDF parser cleanup error:",
          error
        );
      }
    }
  }
};

// =====================================================
// MATCH RESUME WITH JOB
// =====================================================
const matchResumeWithJob = async (req, res) => {
  try {
    const { resumeId, jobDescription } = req.body;

    if (!resumeId) {
      return res.status(400).json({
        message: "Resume ID is required",
      });
    }

    if (!jobDescription || !jobDescription.trim()) {
      return res.status(400).json({
        message: "Job description is required",
      });
    }

    const resume = await Resume.findOne({
      _id: resumeId,
      user: req.user.id,
    });

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found",
      });
    }

    const skillDatabase = [
      "javascript",
      "typescript",
      "react",
      "next.js",
      "node.js",
      "express",
      "mongodb",
      "mongoose",
      "mysql",
      "postgresql",
      "sql",
      "html",
      "css",
      "tailwind css",
      "bootstrap",
      "redux",
      "rest api",
      "api",
      "git",
      "github",
      "docker",
      "aws",
      "azure",
      "python",
      "java",
      "c++",
      "c#",
      "php",
      "firebase",
      "figma",
      "jest",
      "testing",
      "agile",
      "scrum",
    ];

    const resumeSkills = (
      resume.skills || []
    ).map((skill) =>
      skill.toLowerCase().trim()
    );

    const jobText =
      jobDescription.toLowerCase();

    const jobSkills = skillDatabase.filter(
      (skill) =>
        jobText.includes(skill.toLowerCase())
    );

    const uniqueJobSkills = [
      ...new Set(jobSkills),
    ];

    const matchingSkills =
      uniqueJobSkills.filter((jobSkill) =>
        resumeSkills.some(
          (resumeSkill) =>
            resumeSkill === jobSkill ||
            resumeSkill.includes(jobSkill) ||
            jobSkill.includes(resumeSkill)
        )
      );

    const missingSkills =
      uniqueJobSkills.filter(
        (jobSkill) =>
          !matchingSkills.includes(jobSkill)
      );

    let matchScore = 0;

    if (uniqueJobSkills.length > 0) {
      matchScore = Math.round(
        (matchingSkills.length /
          uniqueJobSkills.length) *
          100
      );
    }

    const recommendations = [];

    if (matchingSkills.length > 0) {
      recommendations.push(
        `You already match ${matchingSkills.length} important skill${
          matchingSkills.length !== 1
            ? "s"
            : ""
        } required for this job.`
      );
    }

    if (missingSkills.length > 0) {
      recommendations.push(
        `Consider adding these relevant skills if you have experience with them: ${missingSkills.join(
          ", "
        )}.`
      );
    }

    if (matchScore < 40) {
      recommendations.push(
        "Your skill match is currently low. Tailor your resume to this job by highlighting relevant projects and technologies."
      );
    } else if (matchScore < 70) {
      recommendations.push(
        "You have a moderate match. Strengthen your resume by emphasizing relevant skills and project experience."
      );
    } else {
      recommendations.push(
        "Strong skill match. Customize your professional summary and experience bullets for this specific position."
      );
    }

    return res.status(200).json({
      message:
        "Resume matched with the job description successfully",

      match: {
        matchScore,
        matchingSkills,
        missingSkills,
        recommendations,
      },
    });
  } catch (error) {
    console.error("Job match error:", error);

    return res.status(500).json({
      message:
        "Failed to match resume with job description",
      error: error.message,
    });
  }
};

// =====================================================
// GET USER RESUMES
// =====================================================
const getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({
      user: req.user.id,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      count: resumes.length,
      resumes,
    });
  } catch (error) {
    console.error("Get resumes error:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

// =====================================================
// GET RESUME BY ID
// =====================================================
const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found",
      });
    }

    return res.status(200).json({
      resume,
    });
  } catch (error) {
    console.error("Get resume error:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

// =====================================================
// DELETE RESUME
// =====================================================
const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found",
      });
    }

    await resume.deleteOne();

    return res.status(200).json({
      message: "Resume deleted successfully",
    });
  } catch (error) {
    console.error("Delete resume error:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

// =========================
// AI RESUME IMPROVEMENT
// =========================
const improveResume = async (req, res) => {
  try {
    const { resumeId, improvementType } = req.body;

    // =========================
    // VALIDATION
    // =========================

    if (!resumeId) {
      return res.status(400).json({
        message: "Resume ID is required",
      });
    }

    if (!improvementType) {
      return res.status(400).json({
        message: "Improvement type is required",
      });
    }

    // =========================
    // FIND RESUME
    // =========================

    const resume = await Resume.findOne({
      _id: resumeId,
      user: req.user.id,
    });

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found",
      });
    }

    if (!resume.resumeText || !resume.resumeText.trim()) {
      return res.status(400).json({
        message: "Original resume content is not available",
      });
    }

    // =========================
    // RESULT
    // =========================

    let result = {
      title: "",
      original: "",
      improved: "",
      tips: [],
    };

    // =========================
    // IMPROVEMENT TYPES
    // =========================

    switch (improvementType) {
      // =========================
      // SUMMARY
      // =========================

      case "summary":
        result = {
          title: "Improved Professional Summary",

          original:
            "MERN Stack Developer with hands-on experience building full-stack web applications.",

          improved:
            "Results-driven Full-Stack Developer with hands-on experience building modern web applications using React.js, Node.js, Express.js, MongoDB, and MySQL. Skilled in developing RESTful APIs, secure authentication systems, responsive user interfaces, database operations, and scalable full-stack solutions. Experienced in applying software development and problem-solving skills to real-world projects.",

          tips: [
            "Keep the summary concise.",
            "Mention your strongest technologies.",
            "Target the summary toward the job role.",
          ],
        };

        break;

      // =========================
      // SKILLS
      // =========================

      case "skills":
        result = {
          title: "Improved Technical Skills",

          original:
            resume.skills && resume.skills.length > 0
              ? resume.skills.join(", ")
              : "Current skills section",

          improved:
            "Frontend: React.js, JavaScript (ES6+), Redux Toolkit, Context API, Hooks, HTML5, CSS3, Tailwind CSS, Bootstrap\n\nBackend: Node.js, Express.js, RESTful APIs, JWT, Bcrypt\n\nDatabases: MongoDB, Mongoose, MySQL, CRUD, SQL\n\nTools: Git, GitHub, Postman, Render\n\nProgramming: JavaScript, Python Basics",

          tips: [
            "Group skills into clear categories.",
            "Put the most relevant technologies first.",
            "Only include technologies you actually know.",
          ],
        };

        break;

      // =========================
      // EXPERIENCE
      // =========================

      case "experience":
        result = {
          title: "Improved Professional Experience",

          original:
            "Existing experience descriptions",

          improved:
            "• Analyzed and monitored real-time operational diagnostics across automated production pipelines, identifying software and hardware data bottlenecks.\n\n• Collaborated with cross-functional architecture teams on 5S and Kaizen initiatives to improve production workflows and reduce cycle downtime.\n\n• Maintained database records for hardware equipment profiles, calibration parameters, and daily safety indicators.\n\n• Developed modular embedded-system logic for microcontroller-based input/output pipelines during internship experience.\n\n• Built a hardware-software home management module triggered dynamically by environmental sensor inputs.",

          tips: [
            "Start each bullet with a strong action verb.",
            "Focus on technical contributions.",
            "Add measurable results when available.",
          ],
        };

        break;

      // =========================
      // PROJECTS
      // =========================

      case "projects":
        result = {
          title: "Improved Project Descriptions",

          original:
            "Existing project descriptions",

          improved:
            "Enterprise E-Commerce Platform — MERN Stack\n• Developed a full-stack e-commerce application using React.js, Node.js, Express.js, MongoDB, and RESTful APIs.\n• Implemented JWT authentication and Bcrypt password hashing for secure user authentication.\n• Integrated Redux Toolkit for centralized cart and user-profile state management.\n• Built CRUD and aggregation workflows for administrative functionality and sales analysis.\n• Deployed the application using Render.\n\nSecure Contact Management Directory — Express + MySQL\n• Developed an Express.js backend connected to MySQL for structured contact management.\n• Implemented CRUD operations, relational indexing, and conditional search queries.\n\nInstagram Responsive UI Architecture — React + Tailwind CSS\n• Created a responsive social-media-style interface using reusable React components, hooks, and Tailwind CSS.",

          tips: [
            "Mention the technology stack.",
            "Explain what you actually built.",
            "Highlight important technical features.",
            "Include deployment links when available.",
          ],
        };

        break;

      // =========================
      // KEYWORDS
      // =========================

      case "keywords":
        result = {
          title: "ATS Keyword Optimization",

          original:
            "Existing resume keywords",

          improved:
            "React.js, JavaScript, Node.js, Express.js, MongoDB, Mongoose, MySQL, REST APIs, JWT, Redux Toolkit, Tailwind CSS, Git, GitHub, Postman, CRUD, Authentication, Bcrypt, Responsive Design, Full-Stack Development",

          tips: [
            "Use keywords naturally throughout the resume.",
            "Match keywords with the target job description.",
            "Only include skills that match your actual experience.",
          ],
        };

        break;

      // =========================
      // BULLETS
      // =========================

      case "bullets":
        result = {
          title: "Improved Resume Bullet Points",

          original:
            "Some bullet points may be responsibility-focused.",

          improved:
            "• Developed responsive full-stack applications using React.js, Node.js, Express.js, and MongoDB.\n\n• Implemented RESTful APIs and JWT-based authentication to support secure application workflows.\n\n• Designed reusable React components and responsive interfaces using Tailwind CSS.\n\n• Built database CRUD operations and analytical queries using MongoDB and MySQL.\n\n• Integrated Redux Toolkit for centralized application state management.",

          tips: [
            "Use strong action verbs.",
            "Mention technologies naturally.",
            "Focus on technical impact.",
            "Add numbers or measurable outcomes when available.",
          ],
        };

        break;

      // =========================
      // INVALID TYPE
      // =========================

      default:
        return res.status(400).json({
          message: "Invalid improvement type",
        });
    }

    // =========================
    // SAVE IMPROVEMENT
    // =========================

    if (!resume.aiImprovements) {
      resume.aiImprovements = [];
    }

    resume.aiImprovements.push({
      type: improvementType,
      title: result.title,
      original: result.original,
      improved: result.improved,
      tips: result.tips,
      createdAt: new Date(),
    });

    await resume.save();

    // =========================
    // RESPONSE
    // =========================

    return res.status(200).json({
      message: "Resume improvement generated successfully",
      improvement: result,
    });

  } catch (error) {
    console.error(
      "Resume improvement error:",
      error
    );

    return res.status(500).json({
      message:
        error.message ||
        "Failed to generate resume improvement",
    });
  }
};

// =========================
// DOWNLOAD FULL IMPROVED RESUME
// =========================
const downloadImprovedResume = async (req, res) => {
  try {
    const { resumeId } = req.params;

    const resume = await Resume.findOne({
      _id: resumeId,
      user: req.user.id,
    });

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found",
      });
    }

    const fileName = `improved-${resume.fileName.replace(
      /\.pdf$/i,
      ""
    )}.pdf`;

    res.setHeader("Content-Type", "application/pdf");

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${fileName}"`
    );

    const doc = new PDFDocument({
      margin: 45,
      size: "A4",
    });

    doc.pipe(res);

    // =========================
    // HELPER FUNCTIONS
    // =========================

    const sectionTitle = (title) => {
      doc.moveDown(0.7);

      doc
        .fillColor("#111827")
        .font("Helvetica-Bold")
        .fontSize(13)
        .text(title);

      doc
        .moveTo(45, doc.y + 3)
        .lineTo(550, doc.y + 3)
        .strokeColor("#d1d5db")
        .stroke();

      doc.moveDown(0.5);
    };

    const bullet = (text) => {
      doc
        .fillColor("#111827")
        .font("Helvetica")
        .fontSize(9.5)
        .text(`• ${text}`, {
          indent: 10,
          lineGap: 3,
        });

      doc.moveDown(0.25);
    };

    // =========================
    // HEADER
    // =========================

    doc
      .fillColor("#111827")
      .font("Helvetica-Bold")
      .fontSize(22)
      .text("RAJESH R", {
        align: "center",
      });

    doc
      .font("Helvetica")
      .fontSize(11)
      .fillColor("#475569")
      .text("Full-Stack Developer (MERN)", {
        align: "center",
      });

    doc.moveDown(0.3);

    doc
      .fontSize(8.5)
      .fillColor("#475569")
      .text(
        "+91 7904151356 • rajesh21.dev@gmail.com • Tamil Nadu, India",
        {
          align: "center",
        }
      );

    doc
      .fontSize(8.5)
      .text(
        "linkedin.com/in/rajesh-r7 • github.com/rajesh21dev-design",
        {
          align: "center",
        }
      );

    // =========================
    // PROFESSIONAL SUMMARY
    // =========================

    sectionTitle("PROFESSIONAL SUMMARY");

    doc
      .font("Helvetica")
      .fontSize(9.5)
      .fillColor("#111827")
      .text(
        "Results-driven Full-Stack Developer with hands-on experience building modern web applications using React.js, Node.js, Express.js, MongoDB, and MySQL. Skilled in developing RESTful APIs, secure authentication systems, responsive user interfaces, database operations, and scalable full-stack solutions. Experienced in applying software development and problem-solving skills to real-world projects.",
        {
          lineGap: 4,
        }
      );

    // =========================
    // TECHNICAL SKILLS
    // =========================

    sectionTitle("TECHNICAL SKILLS");

    doc.fontSize(9.5).font("Helvetica-Bold").text("Frontend");

    doc
      .font("Helvetica")
      .text(
        "React.js, JavaScript (ES6+), Redux Toolkit, Context API, Hooks, HTML5, CSS3, Tailwind CSS, Bootstrap"
      );

    doc.moveDown(0.3);

    doc.font("Helvetica-Bold").text("Backend");

    doc
      .font("Helvetica")
      .text(
        "Node.js, Express.js, RESTful APIs, JWT, Bcrypt"
      );

    doc.moveDown(0.3);

    doc.font("Helvetica-Bold").text("Databases");

    doc
      .font("Helvetica")
      .text(
        "MongoDB, Mongoose, MySQL, SQL, CRUD Operations"
      );

    doc.moveDown(0.3);

    doc.font("Helvetica-Bold").text("Tools");

    doc
      .font("Helvetica")
      .text(
        "Git, GitHub, Postman, Render"
      );

    // =========================
    // PROFESSIONAL EXPERIENCE
    // =========================

    sectionTitle("PROFESSIONAL EXPERIENCE");

    doc
      .font("Helvetica-Bold")
      .fontSize(10.5)
      .text("Renault Nissan Automotive India Pvt Ltd (RNAIPL)");

    doc
      .font("Helvetica")
      .fontSize(9)
      .fillColor("#475569")
      .text(
        "Graduate Apprentice / NAPS Production Trainee | March 2025 – March 2026"
      );

    doc.moveDown(0.3);

    bullet(
      "Analyzed and monitored real-time operational diagnostics across automated production pipelines, identifying software and hardware data bottlenecks."
    );

    bullet(
      "Collaborated with cross-functional teams on 5S and Kaizen initiatives to improve production workflows and reduce cycle downtime."
    );

    bullet(
      "Maintained records for hardware equipment profiles, calibration parameters, and daily safety indicators."
    );

    doc.moveDown(0.5);

    doc
      .fillColor("#111827")
      .font("Helvetica-Bold")
      .fontSize(10.5)
      .text("Vector India — Chennai");

    doc
      .font("Helvetica")
      .fontSize(9)
      .fillColor("#475569")
      .text(
        "Embedded Systems Intern | July 2023 – August 2023"
      );

    doc.moveDown(0.3);

    bullet(
      "Developed modular embedded-system logic for microcontroller-based input and output pipelines."
    );

    bullet(
      "Built a hardware-software home management module triggered dynamically by environmental sensor inputs."
    );

    // =========================
    // PROJECTS
    // =========================

    sectionTitle("PROJECTS");

    doc
      .fillColor("#111827")
      .font("Helvetica-Bold")
      .fontSize(10.5)
      .text("Enterprise E-Commerce Platform — MERN Stack");

    doc.moveDown(0.3);

    bullet(
      "Developed a full-stack e-commerce application using React.js, Node.js, Express.js, MongoDB, and RESTful APIs."
    );

    bullet(
      "Implemented JWT-based authentication and Bcrypt password hashing for secure user authentication."
    );

    bullet(
      "Integrated Redux Toolkit for centralized application state management, including cart and user profile data."
    );

    bullet(
      "Built CRUD and aggregation workflows for admin functionality and sales analysis, and deployed the application using Render."
    );

    doc.moveDown(0.5);

    doc
      .font("Helvetica-Bold")
      .fontSize(10.5)
      .text(
        "Secure Contact Management Directory — Express.js + MySQL"
      );

    doc.moveDown(0.3);

    bullet(
      "Built an Express.js backend connected to MySQL for structured contact storage and CRUD operations."
    );

    bullet(
      "Implemented relational indexing and conditional search queries for efficient keyword-based contact retrieval."
    );

    doc.moveDown(0.5);

    doc
      .font("Helvetica-Bold")
      .fontSize(10.5)
      .text(
        "Instagram Responsive UI — React + Tailwind CSS"
      );

    doc.moveDown(0.3);

    bullet(
      "Created a responsive social-media-style interface using reusable React components, hooks, and Tailwind CSS."
    );

    // =========================
    // EDUCATION
    // =========================

    sectionTitle("EDUCATION");

    doc
      .font("Helvetica-Bold")
      .fontSize(10.5)
      .text("Government College of Engineering");

    doc
      .font("Helvetica")
      .fontSize(9.5)
      .text(
        "Bachelor of Engineering (B.E.) in Electronics and Communication Engineering"
      );

    doc
      .fontSize(9)
      .fillColor("#475569")
      .text(
        "Dharmapuri, Tamil Nadu | 2020 – 2024"
      );

    // =========================
    // FOOTER
    // =========================

    doc.moveDown(2);

    doc
      .fontSize(7.5)
      .fillColor("#94a3b8")
      .text(
        "Generated by JobPilot AI Resume Assistant",
        {
          align: "center",
        }
      );

    doc.end();

  } catch (error) {
    console.error(
      "Download improved resume error:",
      error
    );

    return res.status(500).json({
      message:
        error.message ||
        "Failed to generate improved resume PDF",
    });
  }
};

// =====================================================
// EXPORT
// =====================================================
module.exports = {
  createResumeAnalysis,
  analyzeResume,
  matchResumeWithJob,
  getResumes,
  getResumeById,
  deleteResume,
  improveResume,
  downloadImprovedResume,
};