import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

import {
  ArrowLeft,
  Building2,
  BriefcaseBusiness,
  CalendarDays,
  FileText,
  Pencil,
  Trash2,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Clock3,
  MapPin,
  Video,
  MessageSquareText,
  X,
} from "lucide-react";

function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);

  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    company: "",
    role: "",
    status: "Applied",
    jobDescription: "",
    notes: "",
    interviewDate: "",
    interviewTime: "",
    interviewLocation: "",
    interviewLink: "",
    interviewNotes: "",
  });

  // =========================
  // FETCH JOB DETAILS
  // =========================
  const fetchJob = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/jobs/${id}`);

      const jobData = response.data.job;

      setJob(jobData);

      setFormData({
        company: jobData.company || "",
        role: jobData.role || "",
        status: jobData.status || "Applied",
        jobDescription: jobData.jobDescription || "",
        notes: jobData.notes || "",

        interviewDate: jobData.interviewDate
          ? new Date(jobData.interviewDate)
              .toISOString()
              .split("T")[0]
          : "",

        interviewTime: jobData.interviewTime || "",

        interviewLocation:
          jobData.interviewLocation || "",

        interviewLink:
          jobData.interviewLink || "",

        interviewNotes:
          jobData.interviewNotes || "",
      });
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to load job details"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJob();
  }, [id]);

  // =========================
  // AUTO HIDE ALERTS
  // =========================
  useEffect(() => {
    if (!success && !error) return;

    const timer = setTimeout(() => {
      setSuccess("");
      setError("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [success, error]);

  // =========================
  // INPUT CHANGE
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // CANCEL EDIT
  // =========================
  const handleCancelEdit = () => {
    if (!job) return;

    setFormData({
      company: job.company || "",
      role: job.role || "",
      status: job.status || "Applied",
      jobDescription: job.jobDescription || "",
      notes: job.notes || "",

      interviewDate: job.interviewDate
        ? new Date(job.interviewDate)
            .toISOString()
            .split("T")[0]
        : "",

      interviewTime: job.interviewTime || "",

      interviewLocation:
        job.interviewLocation || "",

      interviewLink:
        job.interviewLink || "",

      interviewNotes:
        job.interviewNotes || "",
    });

    setEditing(false);
  };

  // =========================
  // UPDATE JOB
  // =========================
  const handleUpdate = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (!formData.company.trim()) {
        setError("Company name is required.");
        return;
      }

      if (!formData.role.trim()) {
        setError("Job role is required.");
        return;
      }

      const response = await api.put(
        `/jobs/${id}`,
        formData
      );

      const updatedJob = response.data.job;

      setJob(updatedJob);

      setFormData({
        company: updatedJob.company || "",
        role: updatedJob.role || "",
        status: updatedJob.status || "Applied",
        jobDescription:
          updatedJob.jobDescription || "",
        notes: updatedJob.notes || "",

        interviewDate: updatedJob.interviewDate
          ? new Date(updatedJob.interviewDate)
              .toISOString()
              .split("T")[0]
          : "",

        interviewTime:
          updatedJob.interviewTime || "",

        interviewLocation:
          updatedJob.interviewLocation || "",

        interviewLink:
          updatedJob.interviewLink || "",

        interviewNotes:
          updatedJob.interviewNotes || "",
      });

      setEditing(false);

      setSuccess(
        "Job application updated successfully!"
      );
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to update job application"
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // DELETE JOB
  // =========================
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job application?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/jobs/${id}`);

      navigate("/applications");
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to delete job application"
      );
    }
  };

  // =========================
  // STATUS STYLE
  // =========================
  const getStatusStyle = (status) => {
    switch (status) {
      case "Interview":
        return "bg-violet-50 text-violet-700 border-violet-200";

      case "Offer":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";

      case "Rejected":
        return "bg-rose-50 text-rose-700 border-rose-200";

      default:
        return "bg-blue-50 text-blue-700 border-blue-200";
    }
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />

          <p className="mt-3 text-sm text-slate-500">
            Loading application...
          </p>
        </div>
      </div>
    );
  }

  // =========================
  // NOT FOUND
  // =========================
  if (!job) {
    return (
      <div className="p-8 text-center">
        <AlertCircle className="mx-auto h-10 w-10 text-rose-500" />

        <h2 className="mt-4 text-lg font-bold text-slate-900">
          Application not found
        </h2>

        <button
          onClick={() => navigate("/applications")}
          className="mt-4 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white"
        >
          Back to Applications
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl pb-8">

      {/* ================= HEADER ================= */}
      <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-center">

        <div>
          <button
            onClick={() => navigate("/applications")}
            className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-indigo-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Applications
          </button>

          <div className="flex flex-wrap items-center gap-3">

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-600">
                Application Details
              </p>

              <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900">
                {editing
                  ? formData.role
                  : job.role}
              </h1>

              <p className="mt-2 text-sm font-medium text-slate-500">
                {editing
                  ? formData.company
                  : job.company}
              </p>
            </div>

            <span
              className={`rounded-full border px-3 py-1 text-xs font-bold ${getStatusStyle(
                editing
                  ? formData.status
                  : job.status
              )}`}
            >
              {editing
                ? formData.status
                : job.status}
            </span>

          </div>
        </div>

        <div className="flex flex-wrap gap-3">

          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700"
            >
              <Pencil className="h-4 w-4" />
              Edit Application
            </button>
          ) : (
            <>
              <button
                onClick={handleCancelEdit}
                disabled={saving}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                disabled={saving}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:opacity-70"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}

                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>
            </>
          )}

          <button
            onClick={handleDelete}
            disabled={saving}
            title="Delete application"
            className="flex items-center gap-2 rounded-xl border border-rose-200 bg-white px-4 py-3 text-sm font-bold text-rose-600 transition hover:bg-rose-50 disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
          </button>

        </div>
      </div>

      {/* ================= ALERTS ================= */}
      {(success || error) && (
        <div className="mb-6">

          {success && (
            <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />

              <p className="text-sm font-semibold text-emerald-700">
                {success}
              </p>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-3 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3">
              <AlertCircle className="h-5 w-5 shrink-0 text-rose-600" />

              <p className="text-sm font-semibold text-rose-700">
                {error}
              </p>
            </div>
          )}

        </div>
      )}

      {/* ================= CONTENT ================= */}
      <div className="grid gap-6 lg:grid-cols-3">

        {/* ================= MAIN ================= */}
        <section className="space-y-6 lg:col-span-2">

          {/* POSITION INFORMATION */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">

            <div className="mb-6 flex items-center gap-3">

              <div className="rounded-xl bg-indigo-50 p-3">
                <BriefcaseBusiness className="h-5 w-5 text-indigo-600" />
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  Position Information
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Job role and company details.
                </p>
              </div>

            </div>

            <div className="grid gap-4 md:grid-cols-2">

              <div>
                <label className="mb-2 block text-xs font-bold text-slate-700">
                  Company
                </label>

                <input
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  disabled={!editing}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:opacity-70"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold text-slate-700">
                  Role
                </label>

                <input
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  disabled={!editing}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:opacity-70"
                />
              </div>

            </div>

          </div>

          {/* TECH STACK */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">

            <div className="mb-5 flex items-center gap-3">

              <div className="rounded-xl bg-violet-50 p-3">
                <FileText className="h-5 w-5 text-violet-600" />
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  Job Description & Skills
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Technologies, skills, and role requirements.
                </p>
              </div>

            </div>

            <textarea
              name="jobDescription"
              rows="5"
              value={formData.jobDescription}
              onChange={handleChange}
              disabled={!editing}
              placeholder="React, Node.js, MongoDB..."
              className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:opacity-70"
            />

          </div>

          {/* ================= INTERVIEW DETAILS ================= */}
          {(editing || formData.status === "Interview") && (
            <div className="rounded-2xl border border-violet-100 bg-white p-5 shadow-sm md:p-6">

              <div className="mb-6 flex items-center gap-3">

                <div className="rounded-xl bg-violet-50 p-3">
                  <CalendarDays className="h-5 w-5 text-violet-600" />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">
                    Interview Details
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Manage your interview schedule and meeting information.
                  </p>
                </div>

              </div>

              <div className="grid gap-4 md:grid-cols-2">

                {/* DATE */}
                <div>
                  <label className="mb-2 flex items-center gap-2 text-xs font-bold text-slate-700">
                    <CalendarDays className="h-3.5 w-3.5 text-violet-600" />
                    Interview Date
                  </label>

                  <input
                    type="date"
                    name="interviewDate"
                    value={formData.interviewDate}
                    onChange={handleChange}
                    disabled={!editing}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100 disabled:cursor-not-allowed disabled:opacity-70"
                  />
                </div>

                {/* TIME */}
                <div>
                  <label className="mb-2 flex items-center gap-2 text-xs font-bold text-slate-700">
                    <Clock3 className="h-3.5 w-3.5 text-violet-600" />
                    Interview Time
                  </label>

                  <input
                    type="time"
                    name="interviewTime"
                    value={formData.interviewTime}
                    onChange={handleChange}
                    disabled={!editing}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100 disabled:cursor-not-allowed disabled:opacity-70"
                  />
                </div>

                {/* LOCATION */}
                <div>
                  <label className="mb-2 flex items-center gap-2 text-xs font-bold text-slate-700">
                    <MapPin className="h-3.5 w-3.5 text-violet-600" />
                    Location
                  </label>

                  <input
                    type="text"
                    name="interviewLocation"
                    value={formData.interviewLocation}
                    onChange={handleChange}
                    disabled={!editing}
                    placeholder="Office, Chennai or Remote"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100 disabled:cursor-not-allowed disabled:opacity-70"
                  />
                </div>

                {/* MEETING LINK */}
                <div>
                  <label className="mb-2 flex items-center gap-2 text-xs font-bold text-slate-700">
                    <Video className="h-3.5 w-3.5 text-violet-600" />
                    Meeting Link
                  </label>

                  <input
                    type="url"
                    name="interviewLink"
                    value={formData.interviewLink}
                    onChange={handleChange}
                    disabled={!editing}
                    placeholder="https://meet.google.com/..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100 disabled:cursor-not-allowed disabled:opacity-70"
                  />
                </div>

              </div>

              {/* INTERVIEW NOTES */}
              <div className="mt-4">

                <label className="mb-2 flex items-center gap-2 text-xs font-bold text-slate-700">
                  <MessageSquareText className="h-3.5 w-3.5 text-violet-600" />
                  Interview Notes
                </label>

                <textarea
                  name="interviewNotes"
                  rows="5"
                  value={formData.interviewNotes}
                  onChange={handleChange}
                  disabled={!editing}
                  placeholder="Add interviewer details, preparation notes, questions, or follow-up information..."
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100 disabled:cursor-not-allowed disabled:opacity-70"
                />

              </div>

              {/* MEETING LINK */}
              {!editing &&
                formData.interviewLink && (
                  <a
                    href={formData.interviewLink}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 flex w-fit items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-violet-700"
                  >
                    <Video className="h-4 w-4" />
                    Join Interview
                  </a>
                )}

            </div>
          )}

          {/* PERSONAL NOTES */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">

            <div className="mb-5 flex items-center gap-3">

              <div className="rounded-xl bg-amber-50 p-3">
                <FileText className="h-5 w-5 text-amber-600" />
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  Personal Notes
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Add reminders, follow-ups, or application notes.
                </p>
              </div>

            </div>

            <textarea
              name="notes"
              rows="6"
              value={formData.notes}
              onChange={handleChange}
              disabled={!editing}
              placeholder="Add notes about this application..."
              className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:opacity-70"
            />

          </div>

        </section>

        {/* ================= SIDEBAR ================= */}
        <aside className="space-y-6">

          {/* STATUS */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <h3 className="mb-4 text-sm font-bold text-slate-900">
              Application Status
            </h3>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              disabled={!editing}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <option value="Applied">
                Applied
              </option>

              <option value="Interview">
                Interview
              </option>

              <option value="Offer">
                Offer
              </option>

              <option value="Rejected">
                Rejected
              </option>
            </select>

          </div>

          {/* ADDED DATE */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center gap-3">

              <div className="rounded-xl bg-slate-100 p-3">
                <CalendarDays className="h-5 w-5 text-slate-600" />
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-400">
                  Added On
                </p>

                <p className="mt-1 text-sm font-bold text-slate-800">
                  {job.createdAt
                    ? new Date(
                        job.createdAt
                      ).toLocaleDateString()
                    : "Not available"}
                </p>
              </div>

            </div>

          </div>

          {/* INTERVIEW SUMMARY */}
          {formData.status === "Interview" && (
            <div className="rounded-2xl border border-violet-100 bg-violet-50 p-5">

              <div className="flex items-center gap-3">

                <div className="rounded-xl bg-white p-3 shadow-sm">
                  <CalendarDays className="h-5 w-5 text-violet-600" />
                </div>

                <div>
                  <p className="text-xs font-semibold text-violet-500">
                    Interview
                  </p>

                  <p className="mt-1 text-sm font-bold text-violet-900">
                    {formData.interviewDate
                      ? new Date(
                          formData.interviewDate
                        ).toLocaleDateString()
                      : "Date not set"}
                  </p>
                </div>

              </div>

              {formData.interviewTime && (
                <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-violet-700">

                  <Clock3 className="h-4 w-4" />

                  {formData.interviewTime}

                </div>
              )}

              {formData.interviewLocation && (
                <div className="mt-3 flex items-start gap-2 text-xs font-semibold text-violet-700">

                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" />

                  <span>
                    {formData.interviewLocation}
                  </span>

                </div>
              )}

            </div>
          )}

          {/* COMPANY CARD */}
          <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-indigo-600 to-violet-600 p-5 text-white shadow-sm">

            <Building2 className="h-6 w-6 opacity-80" />

            <p className="mt-5 text-xs font-semibold text-indigo-100">
              Company
            </p>

            <h3 className="mt-1 text-lg font-extrabold">
              {editing
                ? formData.company
                : job.company}
            </h3>

            <p className="mt-3 text-xs leading-relaxed text-indigo-100">
              Keep your application pipeline organized and up to date.
            </p>

          </div>

        </aside>

      </div>

    </div>
  );
}

export default JobDetails;