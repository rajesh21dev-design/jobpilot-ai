import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

import {
  BriefcaseBusiness,
  BarChart3,
  Send,
  CalendarDays,
  XCircle,
  Trophy,
  PlusCircle,
  Trash2,
  Search,
  CheckCircle2,
  AlertCircle,
  Plus,
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function Dashboard() {

  const navigate = useNavigate();
  // =========================
  // STATES
  // =========================
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    company: "",
    role: "",
    status: "Applied",
    jobDescription: "",
    notes: "",
  });

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
        "Failed to fetch job applications"
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
  // FORM CHANGE
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // =========================
  // ADD JOB
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setSuccess("");

      const response = await api.post("/jobs", formData);

      setJobs((prevJobs) => [
        response.data.job,
        ...prevJobs,
      ]);

      setFormData({
        company: "",
        role: "",
        status: "Applied",
        jobDescription: "",
        notes: "",
      });

      setSuccess("Application tracked successfully!");
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
        "Failed to add job application"
      );
    }
  };

  // =========================
  // DELETE JOB
  // =========================
  const handleDelete = async (jobId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job application?"
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

      setSuccess("Job application removed.");
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
        "Failed to delete job application"
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

      setSuccess("Status updated.");
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
        "Failed to update status"
      );
    }
  };

  // =========================
  // METRICS
  // =========================
  const appliedCount = jobs.filter(
    (job) => job.status === "Applied"
  ).length;

  const interviewCount = jobs.filter(
    (job) => job.status === "Interview"
  ).length;

  const offerCount = jobs.filter(
    (job) => job.status === "Offer"
  ).length;

  const rejectedCount = jobs.filter(
    (job) => job.status === "Rejected"
  ).length;

  // =========================
  // SEARCH FILTER
  // =========================
  const filteredJobs = jobs.filter((job) => {
    const company = job.company || "";
    const role = job.role || "";

    return (
      company
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      role
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  });

  // =========================
  // STATUS STYLES
  // =========================
  const statusStyles = {
    Applied:
      "bg-indigo-50 text-indigo-700 border-indigo-200",

    Interview:
      "bg-amber-50 text-amber-700 border-amber-200",

    Offer:
      "bg-emerald-50 text-emerald-700 border-emerald-200",

    Rejected:
      "bg-rose-50 text-rose-700 border-rose-200",
  };

  // =========================
  // CHART DATA
  // =========================
  const chartData = [
    {
      name: "Applied",
      count: appliedCount,
    },
    {
      name: "Interview",
      count: interviewCount,
    },
    {
      name: "Offer",
      count: offerCount,
    },
    {
      name: "Rejected",
      count: rejectedCount,
    },
  ];

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />

        <p className="mt-4 text-sm font-medium text-slate-600">
          Loading your dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl">

      {/* ================= TOASTS ================= */}
      {(error || success) && (
        <div className="fixed right-6 top-20 z-50 flex max-w-sm flex-col gap-2">
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

      {/* ================= WELCOME + SEARCH ================= */}
      <section className="mb-7 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-medium text-slate-500">
            Welcome back 👋
          </p>

          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900">
            Your job search dashboard
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Track your applications, interviews, and career opportunities.
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            placeholder="Search applications..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pl-10 text-xs font-medium outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          />
        </div>
      </section>

      {/* ================= METRICS ================= */}
      <section className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-5">
        {[
          {
            label: "Total Apps",
            val: jobs.length,
            icon: BriefcaseBusiness,
            color: "text-slate-600",
            bg: "bg-slate-100",
          },
          {
            label: "Applied",
            val: appliedCount,
            icon: Send,
            color: "text-indigo-600",
            bg: "bg-indigo-50",
          },
          {
            label: "Interviews",
            val: interviewCount,
            icon: CalendarDays,
            color: "text-amber-600",
            bg: "bg-amber-50",
          },
          {
            label: "Offers",
            val: offerCount,
            icon: Trophy,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
          },
          {
            label: "Rejected",
            val: rejectedCount,
            icon: XCircle,
            color: "text-rose-600",
            bg: "bg-rose-50",
          },
        ].map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.label}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {card.label}
                </span>

                <div className={`rounded-xl ${card.bg} p-2`}>
                  <Icon
                    className={`h-4 w-4 ${card.color}`}
                  />
                </div>
              </div>

              <h3 className="mt-4 text-2xl font-extrabold text-slate-900">
                {card.val}
              </h3>
            </div>
          );
        })}
      </section>

      {/* ================= CHART ================= */}
      <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-600">
              Analytics
            </p>

            <h2 className="mt-1 text-lg font-bold text-slate-900">
              Application Progress
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Overview of your applications by status.
            </p>
          </div>

          <div className="rounded-xl bg-indigo-50 p-3">
            <BarChart3 className="h-5 w-5 text-indigo-600" />
          </div>
        </div>

        <div className="h-[280px] w-full">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <BarChart
              data={chartData}
              margin={{
                top: 10,
                right: 10,
                left: -20,
                bottom: 0,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
              />

              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
              />

              <YAxis
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
              />

              <Tooltip
                cursor={{
                    fill: "rgba(33, 33, 224, 0.05)",
                  }} 
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  fontSize: "12px",
                }}
              />

              <Bar
                dataKey="count"
                radius={[8, 8, 0, 0]}
                fill="#6366f1"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* ================= ADD JOB + TABLE ================= */}
      <div className="grid items-start gap-6 lg:grid-cols-3">

        {/* ADD JOB */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center gap-2 border-b border-slate-100 pb-3">
            <div className="rounded-xl bg-indigo-50 p-2">
              <PlusCircle className="h-4 w-4 text-indigo-600" />
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                Quick Add
              </p>

              <h2 className="text-sm font-bold text-slate-900">
                Track New Position
              </h2>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-3.5"
          >
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Company
              </label>

              <input
                type="text"
                name="company"
                required
                value={formData.company}
                onChange={handleChange}
                placeholder="e.g. Google"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-medium outline-none transition focus:border-indigo-400 focus:bg-white"
              />
            </div>

            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Role Title
              </label>

              <input
                type="text"
                name="role"
                required
                value={formData.role}
                onChange={handleChange}
                placeholder="e.g. Frontend Developer"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-medium outline-none transition focus:border-indigo-400 focus:bg-white"
              />
            </div>

            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Status
              </label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-medium outline-none transition focus:border-indigo-400 focus:bg-white"
              >
                <option value="Applied">Applied</option>
                <option value="Interview">Interview</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Tech Stack
              </label>

              <textarea
                name="jobDescription"
                rows="3"
                value={formData.jobDescription}
                onChange={handleChange}
                placeholder="React, Node.js, MongoDB..."
                className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-medium outline-none transition focus:border-indigo-400 focus:bg-white"
              />
            </div>

            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Notes
              </label>

              <textarea
                name="notes"
                rows="3"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Add recruiter details, interview notes, follow-up reminders..."
                className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-medium outline-none transition focus:border-indigo-400 focus:bg-white"
              />
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4" />
              Add Application
            </button>
          </form>
        </section>

        {/* ================= APPLICATION TABLE ================= */}
        <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
          <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                Pipeline
              </p>

              <h2 className="mt-1 text-sm font-bold text-slate-900">
                Recent Applications
              </h2>
            </div>

            <span className="rounded-full bg-indigo-50 px-3 py-1 text-[10px] font-bold text-indigo-600">
              {filteredJobs.length} Entries
            </span>
          </div>

          {filteredJobs.length === 0 ? (
            <div className="py-16 text-center">
              <BriefcaseBusiness className="mx-auto h-8 w-8 text-slate-300" />

              <h3 className="mt-4 text-sm font-bold text-slate-600">
                No applications found
              </h3>

              <p className="mt-2 text-xs text-slate-400">
                Add your first job application to begin tracking.
              </p>
            </div>
          ) : (
           
            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[620px] table-fixed border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="w-[30%] pb-3">Position</th>
                    <th className="w-[25%] pb-3">Tech Stack</th>
                    <th className="w-[20%] pb-3">Status</th>
                    <th className="w-[25%] pb-3 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredJobs.map((job) => (
                    <tr
                      key={job._id}
                      className="group transition hover:bg-slate-50"
                    >
                      {/* POSITION */}
                      <td className="py-4 pr-4">
                        <p className="text-sm font-bold text-slate-900">
                          {job.role}
                        </p>

                        <p className="mt-1 text-xs font-semibold text-indigo-600">
                          {job.company}
                        </p>
                      </td>

                      {/* TECH STACK */}
                      <td className="max-w-[220px] py-4 pr-4">
                        <p className="truncate text-xs text-slate-500">
                          {job.jobDescription || "No tech stack tagged"}
                        </p>
                      </td>

                      {/* STATUS */}
                      <td className="whitespace-nowrap py-4 pr-4">
                        <select
                          value={job.status}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) =>
                            handleStatusChange(
                              job._id,
                              e.target.value
                            )
                          }
                          className={`cursor-pointer rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider outline-none ${statusStyles[job.status] ||
                            "border-slate-200 bg-slate-50 text-slate-700"
                            }`}
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
                      </td>

                      {/* ACTIONS */}
                      <td className="whitespace-nowrap py-4 text-right">
                        <div className="flex items-center justify-end gap-2">

                          {/* VIEW JOB DETAILS */}
                          <button
                            type="button"
                            onClick={() =>
                              navigate(`/applications/${job._id}`)
                            }
                            className="rounded-xl bg-indigo-50 px-3 py-2 text-[10px] font-bold text-indigo-600 transition hover:bg-indigo-100 hover:text-indigo-700"
                          >
                            View
                          </button>

                          {/* DELETE */}
                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(job._id)
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-rose-100 bg-rose-50 text-rose-500 transition hover:bg-rose-100 hover:text-rose-600"
                            title="Delete application"
                            aria-label="Delete application"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>

                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Dashboard;

