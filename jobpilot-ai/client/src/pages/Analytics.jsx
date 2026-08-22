import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

import {
  BriefcaseBusiness,
  Send,
  CalendarDays,
  Trophy,
  XCircle,
  TrendingUp,
  Loader2,
  AlertCircle,
  Building2,
  BarChart3,
} from "lucide-react";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

function Analytics() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // FETCH ANALYTICS DATA
  // =========================
  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/jobs");

      const jobData = Array.isArray(response.data?.jobs)
        ? response.data.jobs
        : [];

      setJobs(jobData);
    } catch (error) {
      console.error("Analytics error:", error);

      setError(
        error.response?.data?.message ||
        "Failed to load analytics data"
      );

      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOAD DATA
  // =========================
  useEffect(() => {
    fetchAnalytics();
  }, []);

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />

          <p className="mt-3 text-sm font-medium text-slate-500">
            Loading analytics...
          </p>
        </div>
      </div>
    );
  }

  // =========================
  // ERROR
  // =========================
  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="rounded-2xl border border-rose-100 bg-rose-50 p-6 text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-rose-500" />

          <h2 className="mt-3 font-bold text-rose-700">
            Unable to load analytics
          </h2>

          <p className="mt-2 text-sm text-rose-600">
            {error}
          </p>

          <button
            onClick={fetchAnalytics}
            className="mt-4 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // =========================
  // CALCULATE STATISTICS
  // =========================
  const stats = {
    total: jobs.length,

    applied: jobs.filter(
      (job) => job.status === "Applied"
    ).length,

    interview: jobs.filter(
      (job) => job.status === "Interview"
    ).length,

    offer: jobs.filter(
      (job) => job.status === "Offer"
    ).length,

    rejected: jobs.filter(
      (job) => job.status === "Rejected"
    ).length,
  };

  // =========================
  // ADDITIONAL METRICS
  // =========================
  const responseRate =
    stats.total > 0
      ? Math.round(
        ((stats.interview + stats.offer) / stats.total) * 100
      )
      : 0;

  const offerRate =
    stats.total > 0
      ? Math.round(
        (stats.offer / stats.total) * 100
      )
      : 0;

  const activeApplications =
    stats.applied + stats.interview;

  // =========================
  // STATUS PIE CHART DATA
  // =========================
  const statusData = [
    {
      name: "Applied",
      value: stats.applied,
      color: "#4f46e5",
    },
    {
      name: "Interview",
      value: stats.interview,
      color: "#f59e0b",
    },
    {
      name: "Offer",
      value: stats.offer,
      color: "#10b981",
    },
    {
      name: "Rejected",
      value: stats.rejected,
      color: "#ef4444",
    },
  ].filter((item) => item.value > 0);

  // =========================
  // MONTHLY STATUS ACTIVITY
  // Applied + Interview + Offer + Rejected
  // =========================
  const monthlyMap = {};

  jobs.forEach((job) => {
    const dateValue =
      job.appliedDate || job.createdAt;

    if (!dateValue) return;

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) return;

    const year = date.getFullYear();
    const month = date.getMonth();

    const key = `${year}-${String(
      month + 1
    ).padStart(2, "0")}`;

    if (!monthlyMap[key]) {
      monthlyMap[key] = {
        key,

        month: date.toLocaleString("default", {
          month: "short",
          year: "numeric",
        }),

        applied: 0,
        interview: 0,
        offer: 0,
        rejected: 0,

        dateValue: new Date(year, month, 1),
      };
    }

    // Count applications by status
    switch (job.status) {
      case "Applied":
        monthlyMap[key].applied += 1;
        break;

      case "Interview":
        monthlyMap[key].interview += 1;
        break;

      case "Offer":
        monthlyMap[key].offer += 1;
        break;

      case "Rejected":
        monthlyMap[key].rejected += 1;
        break;

      default:
        break;
    }
  });

  const monthlyData = Object.values(monthlyMap)
    .sort(
      (a, b) =>
        a.dateValue.getTime() -
        b.dateValue.getTime()
    )
    .map((item) => ({
      month: item.month,
      applied: item.applied,
      interview: item.interview,
      offer: item.offer,
      rejected: item.rejected,
    }));

  // =========================
  // RECENT APPLICATIONS
  // =========================
  const recentApplications = [...jobs]
    .sort((a, b) => {
      const dateA = new Date(
        a.createdAt || a.appliedDate || 0
      );

      const dateB = new Date(
        b.createdAt || b.appliedDate || 0
      );

      return dateB - dateA;
    })
    .slice(0, 5);

  // =========================
  // STATUS BADGE STYLE
  // =========================
  const getStatusStyle = (status) => {
    switch (status) {
      case "Applied":
        return "bg-blue-50 text-blue-600";

      case "Interview":
        return "bg-amber-50 text-amber-700";

      case "Offer":
        return "bg-emerald-50 text-emerald-700";

      case "Rejected":
        return "bg-rose-50 text-rose-600";

      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  // =========================
  // STAT CARDS
  // =========================
  const statCards = [
    {
      title: "Total Applications",
      value: stats.total,
      icon: BriefcaseBusiness,
      bg: "bg-indigo-50",
      iconColor: "text-indigo-600",
    },
    {
      title: "Applied",
      value: stats.applied,
      icon: Send,
      bg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Interviews",
      value: stats.interview,
      icon: CalendarDays,
      bg: "bg-amber-50",
      iconColor: "text-amber-600",
    },
    {
      title: "Offers",
      value: stats.offer,
      icon: Trophy,
      bg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      title: "Rejected",
      value: stats.rejected,
      icon: XCircle,
      bg: "bg-rose-50",
      iconColor: "text-rose-600",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl pb-8">

      {/* ================= HEADER ================= */}
      <div className="mb-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-600">
          Insights
        </p>

        <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900">
          Analytics
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Track your job application progress and hiring journey.
        </p>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {statCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500">
                    {card.title}
                  </p>

                  <h2 className="mt-3 text-3xl font-extrabold text-slate-900">
                    {card.value}
                  </h2>
                </div>

                <div
                  className={`rounded-xl p-3 ${card.bg}`}
                >
                  <Icon
                    className={`h-5 w-5 ${card.iconColor}`}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ================= PERFORMANCE INSIGHTS ================= */}
      <section className="mt-6 grid gap-4 md:grid-cols-3">

        {/* ACTIVE APPLICATIONS */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">
                Active Applications
              </p>

              <h3 className="mt-3 text-3xl font-extrabold text-slate-900">
                {activeApplications}
              </h3>

              <p className="mt-2 text-xs text-slate-400">
                Applied + Interview stages
              </p>
            </div>

            <div className="rounded-xl bg-indigo-50 p-3">
              <BriefcaseBusiness className="h-5 w-5 text-indigo-600" />
            </div>
          </div>
        </div>

        {/* RESPONSE RATE */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">
                Response Rate
              </p>

              <h3 className="mt-3 text-3xl font-extrabold text-slate-900">
                {responseRate}%
              </h3>

              <p className="mt-2 text-xs text-slate-400">
                Interviews + offers received
              </p>
            </div>

            <div className="rounded-xl bg-amber-50 p-3">
              <TrendingUp className="h-5 w-5 text-amber-600" />
            </div>
          </div>
        </div>

        {/* OFFER RATE */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">
                Offer Rate
              </p>

              <h3 className="mt-3 text-3xl font-extrabold text-slate-900">
                {offerRate}%
              </h3>

              <p className="mt-2 text-xs text-slate-400">
                Offers compared to total applications
              </p>
            </div>

            <div className="rounded-xl bg-emerald-50 p-3">
              <Trophy className="h-5 w-5 text-emerald-600" />
            </div>
          </div>
        </div>

      </section>

      {/* ================= CHARTS ================= */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">

        {/* ================= STATUS PIE CHART ================= */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-violet-50 p-3">
              <TrendingUp className="h-5 w-5 text-violet-600" />
            </div>

            <div>
              <h2 className="font-bold text-slate-900">
                Application Status
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Distribution of your current applications.
              </p>
            </div>
          </div>

          <div className="mt-6 h-[300px]">
            {statusData.length > 0 ? (
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {statusData.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={entry.color}
                      />
                    ))}
                  </Pie>

                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-400">
                No application data available
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {statusData.map((item) => (
              <div
                key={item.name}
                className="flex items-center gap-2"
              >
                <span
                  className="h-3 w-3 rounded-full"
                  style={{
                    backgroundColor: item.color,
                  }}
                />

                <span className="text-xs font-medium text-slate-600">
                  {item.name}: {item.value}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ================= APPLICATION ACTIVITY ================= */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-indigo-50 p-3">
              <BarChart3 className="h-5 w-5 text-indigo-600" />
            </div>

            <div>
              <h2 className="font-bold text-slate-900">
                Application Activity
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Application status activity over time.
              </p>
            </div>
          </div>

          <div className="mt-6 h-[300px]">
            {monthlyData.length > 0 ? (
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <BarChart
                  data={monthlyData}
                  barGap={4}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                  />

                  <YAxis
                    allowDecimals={false}
                    tickLine={false}
                    axisLine={false}
                  />

                  <Tooltip cursor={{
                    fill: "rgba(69, 69, 224, 0.05)",
                  }} 
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    fontSize: "12px",
                  }} />

                  <Legend />

                  {/* APPLIED */}
                  <Bar
                    dataKey="applied"
                    name="Applied"
                    fill="#4f46e5"
                    radius={[6, 6, 0, 0]}
                  />

                  {/* INTERVIEW */}
                  <Bar
                    dataKey="interview"
                    name="Interview"
                    fill="#fca816"
                    radius={[6, 6, 0, 0]}
                  />

                  {/* OFFER */}
                  <Bar
                    dataKey="offer"
                    name="Offer"
                    fill="#10b981"
                    radius={[6, 6, 0, 0]}
                  />

                  {/* REJECTED */}
                  <Bar
                    dataKey="rejected"
                    name="Rejected"
                    fill="#ef4444"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-400">
                No application activity available
              </div>
            )}
          </div>
        </section>
      </div>

      {/* ================= RECENT APPLICATIONS ================= */}
      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">

        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-bold text-slate-900">
              Recent Applications
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Your latest job applications.
            </p>
          </div>

          <button
            onClick={() => navigate("/applications")}
            className="text-xs font-bold text-indigo-600 transition hover:text-indigo-700"
          >
            View All
          </button>
        </div>

        <div className="mt-5 space-y-3">
          {recentApplications.length > 0 ? (
            recentApplications.map((job) => (
              <button
                key={job._id}
                onClick={() =>
                  navigate(`/applications/${job._id}`)
                }
                className="flex w-full items-center justify-between rounded-xl border border-slate-100 p-4 text-left transition hover:border-indigo-100 hover:bg-indigo-50/40"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-sm font-bold text-slate-600">
                    {(job.company || "?")
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      {job.role}
                    </p>

                    <p className="mt-1 text-xs font-medium text-slate-500">
                      {job.company}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`rounded-full px-3 py-1 text-[10px] font-bold ${getStatusStyle(
                      job.status
                    )}`}
                  >
                    {job.status}
                  </span>

                  <p className="mt-2 text-[10px] text-slate-400">
                    {job.createdAt
                      ? new Date(
                        job.createdAt
                      ).toLocaleDateString()
                      : ""}
                  </p>
                </div>
              </button>
            ))
          ) : (
            <div className="rounded-xl border border-dashed border-slate-200 py-10 text-center">
              <Building2 className="mx-auto h-7 w-7 text-slate-300" />

              <p className="mt-3 text-sm font-semibold text-slate-500">
                No applications yet
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Analytics;