
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BriefcaseBusiness,
  LockKeyhole,
  Mail,
  Sparkles,
} from "lucide-react";
import api from "../services/api";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await api.post("/auth/login", formData);

      localStorage.setItem("token", response.data.token);

      navigate("/dashboard");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-50 antialiased selection:bg-indigo-500 selection:text-white">
      <div className="flex h-full w-full overflow-hidden">

        {/* LEFT BRAND PANEL (AI Cyber-Minimalism) */}
        <div className="relative hidden w-[45%] overflow-hidden bg-[#0A0F1D] p-12 lg:flex lg:flex-col lg:justify-between xl:w-[50%]">
          {/* Futuristic ambient lighting mesh overlay */}
          <div className="absolute -left-20 -top-20 h-[450px] w-[450px] rounded-full bg-gradient-to-br from-indigo-600/30 to-purple-600/0 blur-[100px]" />
          <div className="absolute -bottom-40 -right-20 h-[500px] w-[500px] rounded-full bg-gradient-to-tl from-blue-500/20 to-indigo-500/0 blur-[120px]" />
          
          {/* Technical blueprint background matrix line grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px]" />

          {/* Logo Brand Segment */}
          <div className="relative z-10">
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-b from-white/15 to-white/5 shadow-xl backdrop-blur-md">
                <BriefcaseBusiness className="h-5 w-5 text-indigo-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-white">
                  JobPilot <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">AI</span>
                </h1>
                <p className="text-[11px] font-medium tracking-wide text-slate-400/80">
                  Your career companion
                </p>
              </div>
            </div>
          </div>

          {/* Main Visual Marketing Text */}
          <div className="relative z-10 max-w-lg">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1.5 text-xs font-medium text-indigo-300 backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-indigo-400 animate-pulse" />
              Next-Gen Application Intelligence
            </div>

            <h2 className="text-4xl font-extrabold leading-[1.15] tracking-tight text-white xl:text-5xl">
              Organize your job search.{" "}
              <span className="bg-gradient-to-r from-indigo-200 via-purple-200 to-white bg-clip-text text-transparent">
                Move closer to your next role.
              </span>
            </h2>

            <p className="mt-6 max-w-md text-base leading-relaxed text-slate-400">
              Track applications, optimize resumes for ATS compatibility, analyze job match metrics, and accelerate your complete career journey from one unified interface.
            </p>
          </div>

          {/* Bottom live network validation marker */}
          <div className="relative z-10 flex items-center gap-3 text-xs font-medium text-slate-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            All core engineering services online
          </div>
        </div>

        {/* RIGHT LOGIN INTERFACE PANEL */}
        <div className="flex flex-1 items-center justify-center bg-white px-6 sm:px-16 lg:px-20 xl:px-24">
          <div className="w-full max-w-[420px]">
            
            {/* MOBILE LOGO HEADER DISPLAY */}
            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950">
                <BriefcaseBusiness className="h-5 w-5 text-indigo-400" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight text-slate-900">
                  JobPilot <span className="text-indigo-600">AI</span>
                </h1>
                <p className="text-xs text-slate-500">Your career companion</p>
              </div>
            </div>

            {/* INTERFACE DESCRIPTIVE TITLE */}
            <div className="mb-8">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">
                Welcome Back
              </span>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                Sign in to workspace
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Enter your credentials to manage your smart pipeline.
              </p>
            </div>

            {/* ERROR ALERT TOAST LAYOUT CARD */}
            {error && (
              <div className="mb-6 rounded-xl border border-rose-200/60 bg-rose-50/50 p-4 text-sm font-medium text-rose-600 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-start gap-2.5">
                  <span className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-rose-600" />
                  <p>{error}</p>
                </div>
              </div>
            )}

            {/* ACTIVE DISPATCH FORM */}
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* EMAIL DATA FIELD INPUT */}
              <div>
                <label className="mb-2 block text-xs font-semibold tracking-wide text-slate-600">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-500" />
                  <input
                    type="email"
                    name="email"
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-4 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition duration-200 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                  />
                </div>
              </div>

              {/* PASSWORD DATA FIELD INPUT */}
              <div>
                <label className="mb-2 block text-xs font-semibold tracking-wide text-slate-600">
                  Password
                </label>
                <div className="relative group">
                  <LockKeyhole className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-500" />
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-4 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition duration-200 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                  />
                </div>
              </div>

              {/* ACTION EXECUTE DISPATCH PLATFORM BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-xl shadow-slate-950/10 transition-all duration-200 hover:bg-indigo-600 hover:shadow-indigo-600/20 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Signing in..." : "Sign In to Dashboard"}
              </button>
            </form>

            {/* SEPARATOR LAYOUT SEGMENT CARD MATRIX */}
            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-slate-100" />
              <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                New Platform User?
              </span>
              <div className="h-px flex-1 bg-slate-100" />
            </div>

            {/* ACCOUNT SUBSCRIPTION REDIRECT ACCESS BUTTON */}
            <button
              onClick={() => navigate("/register")}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition duration-200 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 active:scale-[0.98]"
            >
              Create an account
            </button>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
