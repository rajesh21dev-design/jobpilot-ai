import { useEffect, useState } from "react";
import api from "../services/api";

import {
  FileText,
  Upload,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Target,
  Brain,
  TrendingUp,
  X,
  Loader2,
  History,
  Trash2,
  WandSparkles,
  Copy,
  Check,
} from "lucide-react";



function ResumeAI() {
  const [file, setFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [analysis, setAnalysis] = useState(null);

  // =========================
  // JOB MATCHER STATES
  // =========================
  const [jobDescription, setJobDescription] = useState("");
  const [matching, setMatching] = useState(false);
  const [jobMatch, setJobMatch] = useState(null);

  // =========================
  // RESUME HISTORY STATES
  // =========================
  const [savedResumes, setSavedResumes] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [historySearch, setHistorySearch] = useState("");
  const [historySort, setHistorySort] = useState("newest");
  // =========================
// RESUME IMPROVEMENT STATES
// =========================
const [improvementType, setImprovementType] =useState("summary");
const [improving, setImproving] =useState(false);
const [aiImprovement, setAiImprovement] = useState(null);
const [copied, setCopied] = useState(false);
  // =========================
  // LOAD RESUME HISTORY
  // =========================
  const fetchResumeHistory = async () => {
    try {
      setLoadingHistory(true);

      const response = await api.get("/resumes");

      setSavedResumes(response.data?.resumes || []);
    } catch (error) {
      console.error("Failed to load resume history:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load resume history"
      );
    } finally {
      setLoadingHistory(false);
    }
  };

  // =========================
  // INITIAL LOAD
  // =========================
  useEffect(() => {
    fetchResumeHistory();
  }, []);

  // =========================
  // FILE SELECT
  // =========================
  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];

    setError("");
    setSuccess("");
    setAnalysis(null);
    setJobMatch(null);
    setAiImprovement(null);
    setCopied(false);

    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      setFile(null);
      setError("Please upload a PDF resume.");
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setFile(null);
      setError("Resume file must be smaller than 5MB.");
      return;
    }

    setFile(selectedFile);
  };

  // =========================
  // REMOVE FILE
  // =========================
  const removeFile = () => {
    setFile(null);
    setAnalysis(null);
    setJobMatch(null);
    setJobDescription("");
    setError("");
    setSuccess("");
    setAiImprovement(null);
    setCopied(false);
  };

  // =========================
  // ANALYZE RESUME
  // =========================
  const handleAnalyze = async () => {
    if (!file) {
      setError("Please upload your resume first.");
      return;
    }

    try {
      setAnalyzing(true);
      setError("");
      setSuccess("");
      setAnalysis(null);
      setJobMatch(null);

      const formData = new FormData();

      formData.append("resume", file);

      const response = await api.post(
        "/resumes/analyze",
        formData
      );

      console.log("Resume analysis response:", response.data);

      if (!response.data?.analysis) {
        throw new Error(
          "Analysis data was not returned by the server."
        );
      }

      setAnalysis({
        ...response.data.analysis,
        _id:
          response.data.resume?._id ||
          response.data.analysis?._id ||
          null,
      });

      setSuccess(
        "Resume analyzed successfully. You can now match it with the job description."
      );

      await fetchResumeHistory();
    } catch (error) {
      console.error("Resume analysis error:", error);

      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to analyze resume."
      );
    } finally {
      setAnalyzing(false);
    }
  };

  // =========================
  // ANALYZE JOB MATCH
  // =========================
  const handleJobMatch = async () => {
    if (!analysis?._id) {
      setError(
        "Please analyze and save your resume first."
      );
      return;
    }

    if (!jobDescription.trim()) {
      setError("Please paste the job description.");
      return;
    }

    try {
      setMatching(true);
      setError("");
      setSuccess("");
      setJobMatch(null);

      const response = await api.post(
        "/resumes/job-match",
        {
          resumeId: analysis._id,
          jobDescription,
        }
      );

      console.log("Job match response:", response.data);

      if (!response.data?.match) {
        throw new Error(
          "Job matching data was not returned by the server."
        );
      }

      setJobMatch(response.data.match);

      setSuccess(
        "Resume matched with the job description successfully."
      );
    } catch (error) {
      console.error("Job match error:", error);

      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to match resume with job description."
      );
    } finally {
      setMatching(false);
    }
  };

  // =========================
// GENERATE AI IMPROVEMENT
// =========================
const handleGenerateImprovement = async () => {
  if (!analysis?._id) {
    setError(
      "Please analyze or load a resume first."
    );

    return;
  }

  try {
    setImproving(true);
    setError("");
    setSuccess("");
    setAiImprovement(null);
    setCopied(false);

    const response = await api.post(
      "/resumes/improve",
      {
        resumeId: analysis._id,
        improvementType,
      }
    );

    console.log(
      "Resume improvement response:",
      response.data
    );

    if (!response.data?.improvement) {
      throw new Error(
        "Improvement data was not returned by the server."
      );
    }

    setAiImprovement(
      response.data.improvement
    );

    setSuccess(
      "AI resume improvement generated successfully."
    );
  } catch (error) {
    console.error(
      "Resume improvement error:",
      error
    );

    setError(
      error.response?.data?.message ||
        error.message ||
        "Failed to generate resume improvement."
    );
  } finally {
    setImproving(false);
  }
};

// =========================
// COPY AI IMPROVEMENT
// =========================
const handleCopyImprovement = async () => {
  if (!aiImprovement) return;

  try {
    const textToCopy =
      typeof aiImprovement === "string"
        ? aiImprovement
        : JSON.stringify(
            aiImprovement,
            null,
            2
          );

    await navigator.clipboard.writeText(
      textToCopy
    );

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  } catch (error) {
    console.error(
      "Copy improvement error:",
      error
    );

    setError(
      "Failed to copy AI improvement."
    );
  }
};

  // =========================
  // DELETE SAVED RESUME
  // =========================
  const handleDeleteResume = async (id) => {
    try {
      setError("");
      setSuccess("");
      setAiImprovement(null);
      setCopied(false);

      await api.delete(`/resumes/${id}`);

      setSavedResumes((prev) =>
        prev.filter((resume) => resume._id !== id)
      );

      setSuccess(
        "Resume history deleted successfully."
      );

      if (analysis?._id === id) {
        setAnalysis(null);
        setJobMatch(null);
        setJobDescription("");
      }
    } catch (error) {
      console.error("Delete resume error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to delete resume."
      );
    }
  };

const handleDownloadImprovedResume = async () => {
  if (!analysis?._id) {
    setError(
      "Please analyze and improve your resume first."
    );

    return;
  }

  try {
    setError("");
    setSuccess("");

    const response = await api.get(
      `/resumes/${analysis._id}/download`,
      {
        responseType: "blob",
      }
    );

    const blob = new Blob(
      [response.data],
      {
        type: "application/pdf",
      }
    );

    const url =
      window.URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.setAttribute(
      "download",
      "improved-resume.pdf"
    );

    document.body.appendChild(link);

    link.click();

    link.remove();

    window.URL.revokeObjectURL(url);

    setSuccess(
      "Improved resume downloaded successfully."
    );
  } catch (error) {
    console.error(
      "Download resume error:",
      error
    );

    setError(
      error.response?.data?.message ||
        "Failed to download improved resume."
    );
  }
};

  // =========================
  // LOAD SAVED RESUME
  // =========================
  const handleLoadResume = async (id) => {
    try {
      setError("");
      setSuccess("");
      setJobMatch(null);
      setAiImprovement(null);
      setCopied(false);

      const response = await api.get(`/resumes/${id}`);

      const resume = response.data?.resume;

      if (!resume) {
        throw new Error("Resume data not found");
      }

      setAnalysis({
        _id: resume._id,
        score: resume.score ?? 0,
        atsScore: resume.atsScore ?? 0,
        skillsScore: resume.skillsScore ?? 0,
        experienceScore: resume.experienceScore ?? 0,
        formatScore: resume.formatScore ?? 0,
        strengths: resume.strengths || [],
        improvements:
          resume.improvements ||
          resume.suggestions ||
          [],
        skills: resume.skills || [],
        missingKeywords:
          resume.missingKeywords ||
          resume.missingSkills ||
          [],
      });

      setSuccess(
        "Saved resume analysis loaded. You can now match it with a job description."
      );

      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }, 100);
    } catch (error) {
      console.error("Load resume error:", error);

      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to load saved resume."
      );
    }
  };

  // =========================
  // FILTER + SORT HISTORY
  // =========================
  const filteredResumes = [...savedResumes]
    .filter((resume) =>
      (resume.fileName || "")
        .toLowerCase()
        .includes(historySearch.toLowerCase())
    )
    .sort((a, b) => {
      if (historySort === "highest") {
        return (
          (b.score ?? b.atsScore ?? 0) -
          (a.score ?? a.atsScore ?? 0)
        );
      }

      if (historySort === "lowest") {
        return (
          (a.score ?? a.atsScore ?? 0) -
          (b.score ?? b.atsScore ?? 0)
        );
      }

      return (
        new Date(b.createdAt || 0) -
        new Date(a.createdAt || 0)
      );
    });

  // =========================
  // JOB MATCH STATUS
  // =========================
  const getMatchStatus = (score) => {
    if (score >= 80) {
      return {
        label: "Strong Match",
        description:
          "Your resume is strongly aligned with this job.",
        badge: "bg-emerald-100 text-emerald-700",
        border: "border-emerald-100",
        circle: "border-emerald-100 bg-emerald-50",
        score: "text-emerald-600",
      };
    }

    if (score >= 60) {
      return {
        label: "Good Match",
        description:
          "Your resume matches many of the important job requirements.",
        badge: "bg-blue-100 text-blue-700",
        border: "border-blue-100",
        circle: "border-blue-100 bg-blue-50",
        score: "text-blue-600",
      };
    }

    if (score >= 40) {
      return {
        label: "Moderate Match",
        description:
          "Your resume has some relevant skills, but there is room for improvement.",
        badge: "bg-amber-100 text-amber-700",
        border: "border-amber-100",
        circle: "border-amber-100 bg-amber-50",
        score: "text-amber-600",
      };
    }

    return {
      label: "Low Match",
      description:
        "Your resume currently has limited alignment with this job description.",
      badge: "bg-rose-100 text-rose-700",
      border: "border-rose-100",
      circle: "border-rose-100 bg-rose-50",
      score: "text-rose-600",
    };
  };

  const matchStatus = getMatchStatus(
    Number(jobMatch?.matchScore) || 0
  );

  // =========================
  // SCORE BREAKDOWN
  // =========================
  const scoreBreakdown = [
    {
      title: "ATS Compatibility",
      score: Number(analysis?.atsScore) || 0,
      description:
        "How well your resume is optimized for ATS screening.",
      color: "bg-indigo-600",
      badge: "text-indigo-600 bg-indigo-50",
    },
    {
      title: "Skills",
      score: Number(analysis?.skillsScore) || 0,
      description:
        "Strength and relevance of detected technical skills.",
      color: "bg-violet-600",
      badge: "text-violet-600 bg-violet-50",
    },
    {
      title: "Experience",
      score:
        Number(analysis?.experienceScore) || 0,
      description:
        "Quality and depth of your professional experience.",
      color: "bg-emerald-600",
      badge: "text-emerald-600 bg-emerald-50",
    },
    {
      title: "Formatting",
      score: Number(analysis?.formatScore) || 0,
      description:
        "Structure and readability of your resume.",
      color: "bg-amber-600",
      badge: "text-amber-600 bg-amber-50",
    },
  ];

  const priorityImprovements = [...scoreBreakdown]
    .sort((a, b) => a.score - b.score)
    .slice(0, 2);

  return (
    <div className="mx-auto max-w-7xl pb-8">
      {/* ================= HEADER ================= */}
      <div className="mb-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-600">
          AI Career Assistant
        </p>

        <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900">
          Resume AI
        </h1>

        <p className="mt-2 max-w-2xl text-sm text-slate-500">
          Upload your resume and get an
          AI-powered analysis to improve
          your chances of passing ATS screening.
        </p>
      </div>

      {/* ================= ERROR ================= */}
      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3">
          <AlertCircle className="h-5 w-5 shrink-0 text-rose-600" />

          <p className="text-sm font-semibold text-rose-700">
            {error}
          </p>

          <button
            onClick={() => setError("")}
            className="ml-auto rounded-lg p-1 text-rose-400 hover:bg-rose-100 hover:text-rose-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* ================= SUCCESS ================= */}
      {success && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />

          <p className="text-sm font-semibold text-emerald-700">
            {success}
          </p>

          <button
            onClick={() => setSuccess("")}
            className="ml-auto rounded-lg p-1 text-emerald-400 hover:bg-emerald-100 hover:text-emerald-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* ================= UPLOAD ================= */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-indigo-50 p-3">
            <Sparkles className="h-5 w-5 text-indigo-600" />
          </div>

          <div>
            <h2 className="font-bold text-slate-900">
              Resume Analyzer
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Upload your latest resume in PDF format.
            </p>
          </div>
        </div>

        {!file ? (
          <label className="mt-6 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/70 px-6 py-12 text-center transition hover:border-indigo-300 hover:bg-indigo-50/30">
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <Upload className="h-7 w-7 text-indigo-600" />
            </div>

            <h3 className="mt-4 text-sm font-bold text-slate-800">
              Upload your resume
            </h3>

            <p className="mt-2 text-xs text-slate-500">
              Click here to choose a PDF file
            </p>

            <p className="mt-1 text-[10px] text-slate-400">
              Maximum file size: 5MB
            </p>

            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        ) : (
          <div className="mt-6 rounded-2xl border border-indigo-100 bg-indigo-50/50 p-5">
            <div className="flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-4">
                <div className="rounded-xl bg-white p-3 shadow-sm">
                  <FileText className="h-6 w-6 text-indigo-600" />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-slate-900">
                    {file.name}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>

              <button
                onClick={removeFile}
                disabled={analyzing}
                className="rounded-xl p-2 text-slate-400 transition hover:bg-white hover:text-rose-500 disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {analyzing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing Resume...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Analyze Resume
                </>
              )}
            </button>
          </div>
        )}
      </section>

      {/* ================= JOB MATCHER ================= */}
      <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-violet-50 p-3">
            <Target className="h-5 w-5 text-violet-600" />
          </div>

          <div>
            <h2 className="font-bold text-slate-900">
              Job Description Matcher
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Paste a job description and compare it with your analyzed resume.
            </p>
          </div>
        </div>

        {!analysis?._id && (
          <div className="mt-5 rounded-xl border border-violet-100 bg-violet-50 px-4 py-3">
            <p className="text-xs font-medium text-violet-700">
              Upload and analyze your resume first. You can paste
              the job description now, but matching will be available
              after analysis.
            </p>
          </div>
        )}

        <div className="mt-5">
          <textarea
            value={jobDescription}
            onChange={(e) =>
              setJobDescription(e.target.value)
            }
            placeholder="Paste the complete job description here..."
            rows={8}
            className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 outline-none transition focus:border-violet-400 focus:bg-white"
          />

          <button
            onClick={handleJobMatch}
            disabled={
              !analysis?._id ||
              !jobDescription.trim() ||
              matching
            }
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {matching ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Matching Resume...
              </>
            ) : !analysis?._id ? (
              <>
                <Sparkles className="h-4 w-4" />
                Analyze Resume First
              </>
            ) : (
              <>
                <Target className="h-4 w-4" />
                Match Resume With Job
              </>
            )}
          </button>
        </div>
      </section>

      {/* ================= JOB MATCH RESULT ================= */}
      {jobMatch && (
        <section
          className={`mt-6 rounded-3xl border bg-white p-6 shadow-sm md:p-8 ${matchStatus.border}`}
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet-600">
                    Job Compatibility
                  </p>

                  <h2 className="mt-2 text-2xl font-extrabold text-slate-900">
                    Resume vs Job Description
                  </h2>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${matchStatus.badge}`}
                >
                  {matchStatus.label}
                </span>
              </div>

              <p className="mt-3 max-w-xl text-sm text-slate-500">
                {matchStatus.description}
              </p>

              <div className="mt-5">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span>Job Match Score</span>

                  <span>
                    {Number(jobMatch.matchScore) || 0}%
                  </span>
                </div>

                <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-violet-600 transition-all duration-700"
                    style={{
                      width: `${Math.min(
                        Math.max(
                          Number(jobMatch.matchScore) || 0,
                          0
                        ),
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <div
              className={`flex h-32 w-32 shrink-0 flex-col items-center justify-center rounded-full border-8 ${matchStatus.circle}`}
            >
              <span
                className={`text-4xl font-extrabold ${matchStatus.score}`}
              >
                {Number(jobMatch.matchScore) || 0}%
              </span>

              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
                Match
              </span>
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900">
                  Matching Skills
                </h3>

                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700">
                  {jobMatch.matchingSkills?.length || 0}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {jobMatch.matchingSkills?.length > 0 ? (
                  jobMatch.matchingSkills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-emerald-700 shadow-sm"
                    >
                      ✓ {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-slate-400">
                    No matching skills detected.
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-rose-100 bg-rose-50/60 p-5">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900">
                  Missing Skills
                </h3>

                <span className="rounded-full bg-rose-100 px-2.5 py-1 text-xs font-bold text-rose-700">
                  {jobMatch.missingSkills?.length || 0}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {jobMatch.missingSkills?.length > 0 ? (
                  jobMatch.missingSkills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-rose-700 shadow-sm"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-sm font-medium text-emerald-600">
                    Great! No major missing skills detected.
                  </p>
                )}
              </div>
            </div>
          </div>

          {jobMatch.recommendations?.length > 0 && (
            <div className="mt-6 rounded-2xl border border-amber-100 bg-amber-50/60 p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-amber-100 p-2">
                  <AlertCircle className="h-5 w-5 text-amber-600" />
                </div>

                <div>
                  <h3 className="font-bold text-slate-900">
                    Recommendations
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Suggested improvements for this specific job.
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {jobMatch.recommendations.map(
                  (recommendation, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 rounded-xl bg-white p-4"
                    >
                      <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-100 text-[10px] font-bold text-amber-700">
                        {index + 1}
                      </div>

                      <p className="text-sm font-medium leading-6 text-slate-700">
                        {recommendation}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </section>
      )}

      {/* ================= ANALYSIS ================= */}
      {analysis && (
        <div className="mt-6 space-y-6">
          {/* SCORE HEADER */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-600">
                  AI Analysis Complete
                </p>

                <h2 className="mt-2 text-2xl font-extrabold text-slate-900">
                  Your Resume Score
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Your resume has been analyzed for ATS compatibility
                  and overall quality.
                </p>
              </div>

              <div className="flex h-32 w-32 shrink-0 flex-col items-center justify-center rounded-full border-8 border-indigo-100 bg-indigo-50">
                <span className="text-4xl font-extrabold text-indigo-600">
                  {analysis.score ?? 0}
                </span>

                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  / 100
                </span>
              </div>
            </div>
          </section>

          {/* SCORE CARDS */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "ATS Score",
                value: analysis.atsScore ?? 0,
                icon: Target,
                bg: "bg-indigo-50",
                color: "text-indigo-600",
              },
              {
                title: "Skills",
                value: analysis.skillsScore ?? 0,
                icon: Brain,
                bg: "bg-violet-50",
                color: "text-violet-600",
              },
              {
                title: "Experience",
                value:
                  analysis.experienceScore ?? 0,
                icon: TrendingUp,
                bg: "bg-emerald-50",
                color: "text-emerald-600",
              },
              {
                title: "Formatting",
                value: analysis.formatScore ?? 0,
                icon: FileText,
                bg: "bg-amber-50",
                color: "text-amber-600",
              },
            ].map((item) => {
              const Icon = item.icon;
              const value = Number(item.value) || 0;

              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-slate-500">
                        {item.title}
                      </p>

                      <p className="mt-3 text-2xl font-extrabold text-slate-900">
                        {value}
                      </p>
                    </div>

                    <div
                      className={`rounded-xl p-3 ${item.bg}`}
                    >
                      <Icon
                        className={`h-5 w-5 ${item.color}`}
                      />
                    </div>
                  </div>

                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-indigo-600 transition-all"
                      style={{
                        width: `${Math.min(value, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* ================= AI RESUME IMPROVEMENT ================= */}
<section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">

  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

    <div className="flex items-start gap-3">

      <div className="rounded-xl bg-violet-50 p-3">
        <WandSparkles className="h-5 w-5 text-violet-600" />
      </div>

      <div>

        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet-600">
          AI Resume Assistant
        </p>

        <h2 className="mt-1 text-xl font-extrabold text-slate-900">
          Improve Your Resume
        </h2>

        <p className="mt-2 max-w-xl text-sm text-slate-500">
          Select an area and let AI generate
          a stronger version based on your
          resume analysis.
        </p>

      </div>

    </div>

    <div className="flex flex-col gap-3 sm:flex-row">

      <select
        value={improvementType}
        onChange={(e) => {
          setImprovementType(
            e.target.value
          );

          setAiImprovement(null);
        }}
        disabled={improving}
        className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-violet-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <option value="summary">
          Professional Summary
        </option>

        <option value="skills">
          Skills Improvement
        </option>

        <option value="experience">
          Experience Improvement
        </option>

        <option value="keywords">
          ATS Keywords
        </option>
      </select>

      <button
        onClick={handleGenerateImprovement}
        disabled={improving || !analysis?._id}
        className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {improving ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <WandSparkles className="h-4 w-4" />
            Generate Improvement
          </>
        )}
      </button>

    </div>

  </div>
{/* 
  {aiImprovement && (
    <div className="mt-6 rounded-2xl border border-violet-100 bg-violet-50/50 p-5">

      <div className="flex items-center gap-3">

        <div className="rounded-xl bg-white p-2.5 shadow-sm">
          <Sparkles className="h-5 w-5 text-violet-600" />
        </div>

        <div>

          <h3 className="font-bold text-slate-900">
            AI Generated Improvement
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Review and customize this suggestion
            before adding it to your resume.
          </p>

        </div>

      </div>

      <div className="mt-5 whitespace-pre-wrap rounded-xl border border-violet-100 bg-white p-5 text-sm leading-7 text-slate-700">

        {typeof aiImprovement === "string"
          ? aiImprovement
          : JSON.stringify(
              aiImprovement,
              null,
              2
            )}

      </div>

    </div>
  )} */}

  {/* {aiImprovement && (
  <div className="mt-6 rounded-2xl border border-violet-100 bg-violet-50/50 p-5">

    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

      <div className="flex items-center gap-3">

        <div className="rounded-xl bg-white p-2.5 shadow-sm">
          <Sparkles className="h-5 w-5 text-violet-600" />
        </div>

        <div>

          <h3 className="font-bold text-slate-900">
            AI Generated Improvement
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Review and customize this suggestion
            before adding it to your resume.
          </p>

        </div>

      </div>

      <button
        onClick={handleCopyImprovement}
        className={`flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition ${
          copied
            ? "bg-emerald-600 text-white"
            : "bg-violet-600 text-white hover:bg-violet-700"
        }`}
      >
        {copied ? (
          <>
            <Check className="h-4 w-4" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="h-4 w-4" />
            Copy
          </>
        )}
      </button>

    </div>

    <div className="mt-5 whitespace-pre-wrap rounded-xl border border-violet-100 bg-white p-5 text-sm leading-7 text-slate-700">

      {typeof aiImprovement === "string"
        ? aiImprovement
        : JSON.stringify(
            aiImprovement,
            null,
            2
          )}

    </div>

  </div>
)} */}

{aiImprovement && (
  <div className="mt-6 rounded-2xl border border-violet-100 bg-violet-50/50 p-5">

    {/* HEADER */}
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

      <div className="flex items-center gap-3">

        <div className="rounded-xl bg-white p-2.5 shadow-sm">
          <Sparkles className="h-5 w-5 text-violet-600" />
        </div>

        <div>
          <h3 className="font-bold text-slate-900">
            AI Generated Improvement
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Review and customize this suggestion
            before adding it to your resume.
          </p>
        </div>

      </div>

      {/* COPY BUTTON */}
      <button
        onClick={handleCopyImprovement}
        className={`flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition ${
          copied
            ? "bg-emerald-600 text-white"
            : "bg-violet-600 text-white hover:bg-violet-700"
        }`}
      >
        {copied ? (
          <>
            <Check className="h-4 w-4" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="h-4 w-4" />
            Copy
          </>
        )}
      </button>

    </div>

    {/* AI IMPROVEMENT CONTENT */}
    <div className="mt-5 whitespace-pre-wrap rounded-xl border border-violet-100 bg-white p-5 text-sm leading-7 text-slate-700">

      {typeof aiImprovement === "string"
        ? aiImprovement
        : JSON.stringify(
            aiImprovement,
            null,
            2
          )}

    </div>

    {/* DOWNLOAD BUTTON */}
    <button
      onClick={handleDownloadImprovedResume}
      className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700"
    >
      <FileText className="h-4 w-4" />
      Download Improved Resume PDF
    </button>

  </div>
)}

</section>

          {/* SCORE BREAKDOWN */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-600">
                  Performance Breakdown
                </p>

                <h2 className="mt-2 text-xl font-extrabold text-slate-900">
                  Resume Score Breakdown
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  See which areas of your resume are strongest and which
                  areas need attention.
                </p>
              </div>

              <div className="rounded-xl bg-indigo-50 px-4 py-3">
                <p className="text-xs font-semibold text-indigo-500">
                  Overall Score
                </p>

                <p className="mt-1 text-2xl font-extrabold text-indigo-700">
                  {Number(analysis.score) || 0}/100
                </p>
              </div>
            </div>

            <div className="mt-8 space-y-6">
              {scoreBreakdown.map((item) => {
                const score = Math.min(
                  Math.max(Number(item.score) || 0, 0),
                  100
                );

                return (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-slate-100 bg-slate-50/60 p-5"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="flex items-center gap-3">
                          <span
                            className={`rounded-lg px-3 py-1.5 text-xs font-bold ${item.badge}`}
                          >
                            {item.title}
                          </span>

                          <span className="text-lg font-extrabold text-slate-900">
                            {score}%
                          </span>
                        </div>

                        <p className="mt-2 text-xs text-slate-500">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-200">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${item.color}`}
                        style={{
                          width: `${score}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* PRIORITY IMPROVEMENTS */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-amber-50 p-3">
                <TrendingUp className="h-5 w-5 text-amber-600" />
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-amber-600">
                  Priority Focus
                </p>

                <h2 className="mt-1 text-xl font-extrabold text-slate-900">
                  Improve These Areas First
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  These are the two lowest-scoring areas of your resume.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {priorityImprovements.map((item, index) => {
                const score = Number(item.score) || 0;

                return (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-amber-100 bg-amber-50/50 p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-extrabold text-amber-700">
                          {index + 1}
                        </div>

                        <div>
                          <h3 className="font-bold text-slate-900">
                            Improve {item.title}
                          </h3>

                          <p className="mt-1 text-sm text-slate-500">
                            {item.description}
                          </p>
                        </div>
                      </div>

                      <span className="rounded-lg bg-white px-3 py-1.5 text-sm font-extrabold text-amber-700 shadow-sm">
                        {score}%
                      </span>
                    </div>

                    <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-amber-100">
                      <div
                        className="h-full rounded-full bg-amber-500 transition-all duration-700"
                        style={{
                          width: `${Math.min(
                            Math.max(score, 0),
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* STRENGTHS + IMPROVEMENTS */}
          <div className="grid gap-6 lg:grid-cols-2">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-emerald-50 p-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">
                    Resume Strengths
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    What's already working well.
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {analysis.strengths?.length > 0 ? (
                  analysis.strengths.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 rounded-xl bg-emerald-50/60 p-3"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />

                      <p className="text-sm font-medium text-slate-700">
                        {item}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-400">
                    No strengths available.
                  </p>
                )}
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-amber-50 p-3">
                  <AlertCircle className="h-5 w-5 text-amber-600" />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">
                    Recommended Improvements
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Changes that could improve your score.
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {analysis.improvements?.length > 0 ? (
                  analysis.improvements.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 rounded-xl bg-amber-50/60 p-3"
                    >
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />

                      <p className="text-sm font-medium text-slate-700">
                        {item}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-400">
                    No improvement suggestions available.
                  </p>
                )}
              </div>
            </section>
          </div>

          {/* SKILLS */}
          <div className="grid gap-6 lg:grid-cols-2">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-indigo-50 p-3">
                  <Brain className="h-5 w-5 text-indigo-600" />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">
                    Detected Skills
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Technologies detected in your resume.
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {analysis.skills?.length > 0 ? (
                  analysis.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-600"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-slate-400">
                    No technical skills detected.
                  </p>
                )}
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-rose-50 p-3">
                  <AlertCircle className="h-5 w-5 text-rose-600" />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">
                    Missing Keywords
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Keywords worth considering for ATS matching.
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {analysis.missingKeywords?.length > 0 ? (
                  analysis.missingKeywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="rounded-full bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-600"
                    >
                      {keyword}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-emerald-600">
                    Great! No important missing keywords detected.
                  </p>
                )}
              </div>
            </section>
          </div>
        </div>
      )}

      {/* ================= HISTORY SEARCH ================= */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={historySearch}
          onChange={(e) =>
            setHistorySearch(e.target.value)
          }
          placeholder="Search resume by file name..."
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-indigo-400"
        />

        <select
          value={historySort}
          onChange={(e) =>
            setHistorySort(e.target.value)
          }
          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 outline-none focus:border-indigo-400"
        >
          <option value="newest">
            Newest
          </option>

          <option value="highest">
            Highest Score
          </option>

          <option value="lowest">
            Lowest Score
          </option>
        </select>
      </div>

      {/* ================= RESUME HISTORY ================= */}
      <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-violet-50 p-3">
              <History className="h-5 w-5 text-violet-600" />
            </div>

            <div>
              <h2 className="font-bold text-slate-900">
                Resume History
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Your previously analyzed resumes.
              </p>
            </div>
          </div>

          <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-600">
            {savedResumes.length} Resume
            {savedResumes.length !== 1 ? "s" : ""}
          </span>
        </div>

        {loadingHistory ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-7 w-7 animate-spin text-indigo-600" />

            <p className="mt-3 text-xs font-medium text-slate-400">
              Loading resume history...
            </p>
          </div>
        ) : savedResumes.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-200 py-12 text-center">
            <FileText className="mx-auto h-8 w-8 text-slate-300" />

            <p className="mt-3 text-sm font-semibold text-slate-500">
              No saved resumes yet
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Analyze a resume and it will appear here.
            </p>
          </div>
        ) : filteredResumes.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-200 py-12 text-center">
            <p className="text-sm font-semibold text-slate-500">
              No resumes found
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Try a different search term.
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {filteredResumes.map((resume) => (
              <div
                key={resume._id}
                className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-4 transition hover:border-indigo-100 hover:bg-indigo-50/30 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="rounded-xl bg-white p-3 shadow-sm">
                    <FileText className="h-5 w-5 text-indigo-600" />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-900">
                      {resume.fileName || "Resume"}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {resume.createdAt
                        ? new Date(
                            resume.createdAt
                          ).toLocaleDateString()
                        : "Unknown date"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 sm:justify-end">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="rounded-lg bg-indigo-50 px-3 py-2 text-center">
                      <p className="text-[9px] font-bold uppercase text-indigo-400">
                        Overall
                      </p>

                      <p className="text-sm font-extrabold text-indigo-700">
                        {resume.score ??
                          resume.atsScore ??
                          0}
                      </p>
                    </div>

                    <div className="rounded-lg bg-violet-50 px-3 py-2 text-center">
                      <p className="text-[9px] font-bold uppercase text-violet-400">
                        ATS
                      </p>

                      <p className="text-sm font-extrabold text-violet-700">
                        {resume.atsScore ?? 0}
                      </p>
                    </div>

                    <div className="rounded-lg bg-blue-50 px-3 py-2 text-center">
                      <p className="text-[9px] font-bold uppercase text-blue-400">
                        Skills
                      </p>

                      <p className="text-sm font-extrabold text-blue-700">
                        {resume.skillsScore ?? 0}
                      </p>
                    </div>

                    <div className="rounded-lg bg-emerald-50 px-3 py-2 text-center">
                      <p className="text-[9px] font-bold uppercase text-emerald-400">
                        Experience
                      </p>

                      <p className="text-sm font-extrabold text-emerald-700">
                        {resume.experienceScore ?? 0}
                      </p>
                    </div>

                    <div className="rounded-lg bg-amber-50 px-3 py-2 text-center">
                      <p className="text-[9px] font-bold uppercase text-amber-400">
                        Format
                      </p>

                      <p className="text-sm font-extrabold text-amber-700">
                        {resume.formatScore ?? 0}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      handleLoadResume(resume._id)
                    }
                    className="rounded-xl bg-indigo-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-indigo-700"
                  >
                    View
                  </button>

                  <button
                    onClick={() =>
                      handleDeleteResume(resume._id)
                    }
                    className="rounded-xl p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                    title="Delete resume"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default ResumeAI;