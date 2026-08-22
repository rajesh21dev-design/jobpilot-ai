import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BriefcaseBusiness,
  User,
  Mail,
  LockKeyhole,
  Sparkles,
  ArrowRight,
  AlertCircle
} from "lucide-react";
import api from "../services/api";

const Register = () => {
  const navigate = useNavigate();

  // =========================
  // CORE STATES
  // =========================
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ==========================================
  // AUTO-HIDE ERROR ALERTS AFTER 3 SECONDS
  // ==========================================
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // =========================
  // INPUT & TRIGGER HANDLERS
  // =========================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match.");
    }

    try {
      setLoading(true);
      setError("");

      const response = await api.post("/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        navigate("/dashboard");
      } else {
        navigate("/login");
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };


// return (
//   <div className="flex min-h-screen items-center justify-center bg-[#e5e7eb] p-4 font-sans">

//     {/* MAIN CARD */}
//     <div className="grid w-full max-w-4xl overflow-hidden rounded-[28px] bg-white shadow-[0_20px_50px_rgba(15,23,42,0.20)] md:grid-cols-2">

//       {/* =========================
//           LEFT SIDE
//       ========================= */}
//       <div className="flex min-h-[560px] flex-col items-center justify-center bg-[#172033] px-12 text-center text-white">

//         {/* LOGO */}
//         <div className="mb-14 flex items-center gap-3">

//           <div className="flex h-10 w-10 items-center justify-center">
//             <BriefcaseBusiness className="h-7 w-7 text-indigo-400" />
//           </div>

//           <div className="text-left">
//             <h1 className="text-xl font-bold tracking-tight">
//               JobPilot AI
//             </h1>

//             <p className="text-[10px] text-slate-400">
//               Your career companion
//             </p>
//           </div>

//         </div>


//         {/* MAIN CONTENT */}
//         <div className="max-w-xs">

//           <h2 className="text-4xl font-bold leading-[1.05] tracking-tight">
//             Start your
//             <br />
//             journey
//           </h2>

//           <p className="mt-6 text-sm leading-7 text-slate-300">
//             Organize your job search, track applications, and manage your
//             career opportunities in one workspace.
//           </p>

//         </div>

//       </div>



//       {/* =========================
//           RIGHT SIDE
//       ========================= */}
//       <div className="flex min-h-[560px] items-center bg-[#f8fafc] px-12 py-10">

//         <div className="w-full max-w-sm">

//           {/* TITLE */}
//           <h2 className="mb-8 text-3xl font-bold tracking-tight text-[#172033]">
//             Sign Up
//           </h2>


//           {/* ERROR */}
//           {error && (
//             <div className="mb-5 flex items-center gap-2 border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
//               <AlertCircle className="h-4 w-4 flex-shrink-0" />
//               <span>{error}</span>
//             </div>
//           )}


//           {/* FORM */}
//           <form onSubmit={handleSubmit} className="space-y-6">

//             {/* NAME ROW */}
//             <div className="grid grid-cols-2 gap-4">

//               {/* FULL NAME */}
//               <div>
//                 <label className="mb-1 block text-[10px] font-medium text-slate-400">
//                   First Name
//                 </label>

//                 <input
//                   type="text"
//                   name="name"
//                   placeholder="Your name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   required
//                   className="w-full border-b border-slate-300 bg-transparent py-2 text-xs text-[#172033] outline-none placeholder:text-slate-400 transition focus:border-indigo-600"
//                 />
//               </div>


//               {/* LAST NAME STYLE FIELD */}
//               <div>
//                 <label className="mb-1 block text-[10px] font-medium text-slate-400">
//                   Job Role
//                 </label>

//                 <input
//                   type="text"
//                   placeholder="Your role"
//                   className="w-full border-b border-slate-300 bg-transparent py-2 text-xs text-[#172033] outline-none placeholder:text-slate-400 transition focus:border-indigo-600"
//                 />
//               </div>

//             </div>



//             {/* USER NAME / EMAIL */}
//             <div>

//               <label className="mb-1 block text-[10px] font-medium text-slate-400">
//                 Email Address
//               </label>

//               <input
//                 type="email"
//                 name="email"
//                 placeholder="Enter your email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 required
//                 className="w-full border-b border-slate-300 bg-transparent py-2 text-xs text-[#172033] outline-none placeholder:text-slate-400 transition focus:border-indigo-600"
//               />

//             </div>



//             {/* PASSWORD */}
//             <div>

//               <label className="mb-1 block text-[10px] font-medium text-slate-400">
//                 Choose Password
//               </label>

//               <input
//                 type="password"
//                 name="password"
//                 placeholder="Enter your password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 required
//                 className="w-full border-b border-slate-300 bg-transparent py-2 text-xs text-[#172033] outline-none placeholder:text-slate-400 transition focus:border-indigo-600"
//               />

//             </div>



//             {/* CONFIRM PASSWORD */}
//             <div>

//               <label className="mb-1 block text-[10px] font-medium text-slate-400">
//                 Confirm Password
//               </label>

//               <input
//                 type="password"
//                 name="confirmPassword"
//                 placeholder="Confirm your password"
//                 value={formData.confirmPassword}
//                 onChange={handleChange}
//                 required
//                 className="w-full border-b border-slate-300 bg-transparent py-2 text-xs text-[#172033] outline-none placeholder:text-slate-400 transition focus:border-indigo-600"
//               />

//             </div>



//             {/* TERMS */}
//             <label className="flex items-center gap-2 text-[10px] text-slate-500">

//               <input
//                 type="checkbox"
//                 required
//                 className="h-3 w-3 accent-indigo-600"
//               />

//               <span>
//                 Agree to Terms and Conditions
//               </span>

//             </label>



//             {/* REGISTER BUTTON */}
//             <button
//               type="submit"
//               disabled={loading}
//               className="rounded-sm bg-[#172033] px-10 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-indigo-600 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
//             >
//               {loading ? "Creating..." : "Register"}
//             </button>



//             {/* LOGIN */}
//             <p className="text-[11px] text-slate-500">

//               Already a member?{" "}

//               <button
//                 type="button"
//                 onClick={() => navigate("/login")}
//                 className="font-semibold text-indigo-600 hover:text-indigo-700"
//               >
//                 Login
//               </button>

//             </p>

//           </form>

//         </div>

//       </div>

//     </div>

//   </div>
// );
// return (
//   <div className="flex min-h-screen items-center justify-center bg-[#e5e7eb] p-4 font-sans">

//     {/* MAIN CARD */}
//     <div className="grid w-full max-w-4xl overflow-hidden rounded-[28px] bg-white shadow-[0_20px_50px_rgba(15,23,42,0.20)] md:grid-cols-2">

//       {/* =========================
//           LEFT SIDE
//       ========================= */}
//       <div className="flex min-h-[560px] flex-col items-center justify-center bg-[#172033] px-12 text-center text-white">

//         {/* LOGO */}
//         <div className="mb-14 flex items-center gap-3">

//           <div className="flex h-10 w-10 items-center justify-center">
//             <BriefcaseBusiness className="h-7 w-7 text-indigo-400" />
//           </div>

//           <div className="text-left">
//             <h1 className="text-xl font-bold tracking-tight">
//               JobPilot AI
//             </h1>

//             <p className="text-[10px] text-slate-400">
//               Your career companion
//             </p>
//           </div>

//         </div>

//         {/* MAIN CONTENT */}
//         <div className="max-w-xs">

//           <h2 className="text-4xl font-bold leading-[1.05] tracking-tight">
//             Start your
//             <br />
//             journey
//           </h2>

//           <p className="mt-6 text-sm leading-7 text-slate-300">
//             Organize your job search, track applications, and manage your
//             career opportunities in one workspace.
//           </p>

//         </div>

//       </div>

//       {/* =========================
//           RIGHT SIDE
//       ========================= */}
//       <div className="flex min-h-[560px] items-center bg-[#f8fafc] px-12 py-10">

//         <div className="w-full max-w-sm">

//           {/* TITLE */}
//           <h2 className="mb-8 text-3xl font-bold tracking-tight text-[#172033]">
//             Sign Up
//           </h2>

//           {/* ERROR */}
//           {error && (
//             <div className="mb-5 flex items-center gap-2 border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
//               <AlertCircle className="h-4 w-4 flex-shrink-0" />
//               <span>{error}</span>
//             </div>
//           )}

//           {/* FORM */}
//           <form onSubmit={handleSubmit} className="space-y-6">

//             {/* FULL NAME */}
//             <div>
//               <label className="mb-1 block text-[10px] font-semibold text-slate-600">
//                 Full Name
//               </label>

//               <input
//                 type="text"
//                 name="name"
//                 placeholder="Your name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 required
//                 className="w-full border-b border-slate-300 bg-transparent py-2 text-xs text-[#172033] outline-none placeholder:text-slate-400 transition focus:border-indigo-600"
//               />
//             </div>

//             {/* EMAIL */}
//             <div>
//               <label className="mb-1 block text-[10px] font-semibold text-slate-600">
//                 Email Address
//               </label>

//               <input
//                 type="email"
//                 name="email"
//                 placeholder="Enter your email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 required
//                 className="w-full border-b border-slate-300 bg-transparent py-2 text-xs text-[#172033] outline-none placeholder:text-slate-400 transition focus:border-indigo-600"
//               />
//             </div>

//             {/* PASSWORD */}
//             <div>
//               <label className="mb-1 block text-[10px] font-semibold text-slate-600">
//                 Choose Password
//               </label>

//               <input
//                 type="password"
//                 name="password"
//                 placeholder="Enter your password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 required
//                 className="w-full border-b border-slate-300 bg-transparent py-2 text-xs text-[#172033] outline-none placeholder:text-slate-400 transition focus:border-indigo-600"
//               />
//             </div>

//             {/* CONFIRM PASSWORD */}
//             <div>
//               <label className="mb-1 block text-[10px] font-semibold text-slate-600">
//                 Confirm Password
//               </label>

//               <input
//                 type="password"
//                 name="confirmPassword"
//                 placeholder="Confirm your password"
//                 value={formData.confirmPassword}
//                 onChange={handleChange}
//                 required
//                 className="w-full border-b border-slate-300 bg-transparent py-2 text-xs text-[#172033] outline-none placeholder:text-slate-400 transition focus:border-indigo-600"
//               />
//             </div>

//             {/* TERMS */}
//             <label className="flex items-center gap-2 text-[10px] font-medium text-slate-600">

//               <input
//                 type="checkbox"
//                 required
//                 className="h-3 w-3 accent-indigo-600"
//               />

//               <span>
//                 Agree to Terms and Conditions
//               </span>

//             </label>

//             {/* REGISTER BUTTON */}
//             <button
//               type="submit"
//               disabled={loading}
//               className="rounded-sm bg-[#172033] px-10 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-indigo-600 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
//             >
//               {loading ? "Creating..." : "Register"}
//             </button>

//             {/* LOGIN */}
//             <p className="text-[11px] font-medium text-slate-600">

//               Already a member?{" "}

//               <button
//                 type="button"
//                 onClick={() => navigate("/login")}
//                 className="font-semibold text-indigo-600 hover:text-indigo-700"
//               >
//                 Login
//               </button>

//             </p>

//           </form>

//         </div>

//       </div>

//     </div>

//   </div>
// );
return (
  <div className="flex min-h-screen items-center justify-center bg-[#e5e7eb] p-4 font-sans">

    {/* MAIN CARD */}
    <div className="grid w-full max-w-4xl overflow-hidden rounded-[28px] bg-white shadow-[0_20px_50px_rgba(15,23,42,0.20)] md:grid-cols-2">

      {/* =========================
          LEFT SIDE
      ========================= */}
      <div className="flex min-h-[560px] flex-col items-center justify-center bg-[#172033] px-12 text-center text-white">

        {/* LOGO */}
        <div className="mb-14 flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center">
            <BriefcaseBusiness className="h-7 w-7 text-indigo-400" />
          </div>

          <div className="text-left">
            <h1 className="text-xl font-bold tracking-tight">
              JobPilot AI
            </h1>

            <p className="text-[10px] text-slate-400">
              Your career companion
            </p>
          </div>

        </div>

        {/* MAIN CONTENT */}
        <div className="max-w-xs">

          <h2 className="text-4xl font-bold leading-[1.05] tracking-tight">
            Start your
            <br />
            journey
          </h2>

          <p className="mt-6 text-sm leading-7 text-slate-300">
            Organize your job search, track applications, and manage your
            career opportunities in one workspace.
          </p>

        </div>

      </div>

      {/* =========================
          RIGHT SIDE
      ========================= */}
      <div className="flex min-h-[560px] items-center bg-[#f8fafc] px-12 py-10">

        <div className="w-full max-w-sm">

          {/* TITLE */}
          <h2 className="mb-8 text-3xl font-bold tracking-tight text-[#172033]">
            Sign Up
          </h2>

          {/* ERROR */}
          {error && (
            <div className="mb-5 flex items-center gap-2 border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* =========================
                FULL NAME
            ========================= */}
            <div>
              <label className="mb-1 block text-[12px] font-semibold text-slate-600">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border-b border-slate-300 bg-transparent py-2 text-xs text-[#172033] outline-none placeholder:text-slate-400 transition focus:border-indigo-600"
              />
            </div>

            {/* =========================
                EMAIL
            ========================= */}
            <div>
              <label className="mb-1 block text-[12px] font-semibold text-slate-600">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border-b border-slate-300 bg-transparent py-2 text-xs text-[#172033] outline-none placeholder:text-slate-400 transition focus:border-indigo-600"
              />
            </div>

            {/* =========================
                PASSWORD
            ========================= */}
            <div>
              <label className="mb-1 block text-[12px] font-semibold text-slate-600">
                Choose Password
              </label>

              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full border-b border-slate-300 bg-transparent py-2 text-xs text-[#172033] outline-none placeholder:text-slate-400 transition focus:border-indigo-600"
              />
            </div>

            {/* =========================
                CONFIRM PASSWORD
            ========================= */}
            <div>
              <label className="mb-1 block text-[12px] font-semibold text-slate-600">
                Confirm Password
              </label>

              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full border-b border-slate-300 bg-transparent py-2 text-xs text-[#172033] outline-none placeholder:text-slate-400 transition focus:border-indigo-600"
              />
            </div>

            {/* =========================
                TERMS
            ========================= */}
            <label className="flex items-center gap-2 text-[11px] font-medium text-slate-600">

              <input
                type="checkbox"
                required
                className="h-3 w-3 accent-indigo-600"
              />

              <span>
                Agree to Terms and Conditions
              </span>

            </label>

            {/* =========================
                REGISTER BUTTON
            ========================= */}
            <button
              type="submit"
              disabled={loading}
              className="rounded-sm bg-[#172033] px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-indigo-600 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating..." : "Register"}
            </button>

            {/* =========================
                LOGIN
            ========================= */}
            <p className="text-[13px] font-medium text-slate-600">
              Already have an account?{" "}

              <button
                type="button"
                onClick={() => navigate("/login")}
                className="font-semibold text-indigo-600 transition hover:text-indigo-700"
              >
                Sign In
              </button>
            </p>

          </form>

        </div>

      </div>

    </div>

  </div>
);
}

export default Register;

