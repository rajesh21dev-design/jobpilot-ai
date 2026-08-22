import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

import {
  BriefcaseBusiness,
  Search,
  Filter,
  Trash2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Send,
  CalendarDays,
  Trophy,
  XCircle,
} from "lucide-react";

function Applications() {
  const navigate = useNavigate();
  // =========================
  // STATES
  // =========================
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // =========================
  // FETCH JOBS
  // =========================
  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/jobs");

      setJobs(
        Array.isArray(response.data.jobs)
          ? response.data.jobs
          : []
      );
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
        "Failed to fetch applications"
      );

      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // =========================
  // AUTO HIDE TOAST
  // =========================
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess("");
        setError("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [success, error]);

  // =========================
  // DELETE APPLICATION
  // =========================
  const handleDelete = async (jobId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this application?"
    );

    if (!confirmDelete) return;

    try {
      setError("");
      setSuccess("");

      await api.delete(`/jobs/${jobId}`);

      setJobs((prevJobs) =>
        prevJobs.filter(
          (job) => job._id !== jobId
        )
      );

      setSuccess("Application deleted successfully.");
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
        "Failed to delete application"
      );
    }
  };

  // =========================
  // UPDATE STATUS
  // =========================
  const handleStatusChange = async (
    jobId,
    newStatus
  ) => {
    try {
      setError("");
      setSuccess("");

      const response = await api.put(
        `/jobs/${jobId}`,
        {
          status: newStatus,
        }
      );

      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job._id === jobId
            ? response.data.job
            : job
        )
      );

      setSuccess("Application status updated.");
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
        "Failed to update application"
      );
    }
  };

  // =========================
  // FILTER JOBS
  // =========================
  const filteredJobs = jobs.filter((job) => {
    const company = job.company || "";
    const role = job.role || "";

    const matchesSearch =
      company
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      role
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ||
      job.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // =========================
  // STATUS STYLES
  // =========================
  const statusStyles = {
    Applied: {
      badge:
        "bg-indigo-50 text-indigo-700 border-indigo-200",
      icon: Send,
    },

    Interview: {
      badge:
        "bg-amber-50 text-amber-700 border-amber-200",
      icon: CalendarDays,
    },

    Offer: {
      badge:
        "bg-emerald-50 text-emerald-700 border-emerald-200",
      icon: Trophy,
    },

    Rejected: {
      badge:
        "bg-rose-50 text-rose-700 border-rose-200",
      icon: XCircle,
    },
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />

        <p className="mt-4 text-sm font-medium text-slate-500">
          Loading applications...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-full">

      {/* ================= TOASTS ================= */}
      {(error || success) && (
        <div className="fixed right-6 top-6 z-50 flex max-w-sm flex-col gap-2">

          {error && (
            <div className="flex items-center gap-3 rounded-2xl border border-rose-100 bg-white p-4 shadow-xl">
              <AlertCircle className="h-5 w-5 shrink-0 text-rose-500" />

              <p className="text-xs font-semibold text-slate-700">
                {error}
              </p>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-white p-4 shadow-xl">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />

              <p className="text-xs font-semibold text-slate-700">
                {success}
              </p>
            </div>
          )}
        </div>
      )}

      {/* ================= PAGE HEADER ================= */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-600">
            Application Management
          </p>

          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900">
            Job Applications
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Manage and track all your job applications in one place.
          </p>
        </div>

        <button
          onClick={fetchJobs}
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 shadow-sm transition hover:bg-slate-50"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* ================= FILTER BAR ================= */}
      <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center">

        {/* SEARCH */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            placeholder="Search by company or role..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 pl-10 text-xs font-medium outline-none transition focus:border-indigo-400 focus:bg-white"
          />
        </div>

        {/* STATUS FILTER */}
        <div className="flex items-center gap-2">

          <div className="flex items-center gap-2 text-slate-400">
            <Filter className="h-4 w-4" />

            <span className="text-[10px] font-bold uppercase tracking-wider">
              Filter
            </span>
          </div>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-600 outline-none focus:border-indigo-400"
          >
            <option value="All">
              All Status
            </option>

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
      </div>

      {/* ================= APPLICATION TABLE ================= */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        {/* TABLE HEADER */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">

          <div className="flex items-center gap-3">

            <div className="rounded-xl bg-indigo-50 p-2">
              <BriefcaseBusiness className="h-4 w-4 text-indigo-600" />
            </div>

            <div>
              <h2 className="text-sm font-bold text-slate-900">
                All Applications
              </h2>

              <p className="mt-0.5 text-xs text-slate-400">
                {filteredJobs.length} application
                {filteredJobs.length !== 1 ? "s" : ""} found
              </p>
            </div>
          </div>
        </div>

        {/* EMPTY STATE */}
        {filteredJobs.length === 0 ? (
          <div className="py-20 text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
              <BriefcaseBusiness className="h-6 w-6 text-slate-400" />
            </div>

            <h3 className="mt-5 text-base font-bold text-slate-700">
              No applications found
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              Try changing your search or filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full min-w-[800px] text-left">

              <thead className="bg-slate-50">
                <tr className="text-[10px] font-bold uppercase tracking-wider text-slate-400">

                  <th className="px-5 py-4">
                    Position
                  </th>

                  <th className="px-5 py-4">
                    Tech Stack
                  </th>

                  <th className="px-5 py-4">
                    Status
                  </th>

                  <th className="px-5 py-4 text-right">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">

                {filteredJobs.map((job) => {
                  const currentStatus =
                    statusStyles[job.status] ||
                    statusStyles.Applied;

                  const StatusIcon =
                    currentStatus.icon;

                  return (
                    <tr
                      key={job._id}
                      className="group transition hover:bg-slate-50"
                    >

                      {/* POSITION */}
                      <td className="px-5 py-4">
                        <div
                          onClick={() => navigate(`/applications/${job._id}`)}
                          className="flex cursor-pointer items-center gap-3 rounded-xl p-2 transition hover:bg-indigo-50"
                        >
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-sm font-bold text-slate-600">
                            {(job.company || "?")
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div>
                            <p className="text-sm font-bold text-slate-900">
                              {job.role}
                            </p>

                            <p className="mt-1 text-xs font-medium text-indigo-600">
                              {job.company}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* TECH STACK */}
                      <td className="max-w-[260px] px-5 py-4">

                        <p className="truncate text-xs text-slate-500">
                          {job.jobDescription ||
                            "No tech stack added"}
                        </p>
                      </td>

                      {/* STATUS */}
                      <td className="px-5 py-4">

                        <div className="flex items-center gap-2">

                          <StatusIcon
                            className="h-3.5 w-3.5 text-slate-400"
                          />

                          <select
                            value={job.status}
                            onChange={(e) =>
                              handleStatusChange(
                                job._id,
                                e.target.value
                              )
                            }
                            className={`rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider outline-none ${currentStatus.badge}`}
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
                      </td>

                      {/* ACTIONS */}
                      <td className="px-5 py-4 text-right">

                        <button
                          onClick={() =>
                            handleDelete(job._id)
                          }
                          className="rounded-xl p-2 text-slate-300 transition hover:bg-rose-50 hover:text-rose-500"
                          title="Delete application"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Applications;