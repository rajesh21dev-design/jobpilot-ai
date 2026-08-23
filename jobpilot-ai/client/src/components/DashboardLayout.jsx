// import { NavLink, Outlet, useNavigate } from "react-router-dom";
// import {
//   LayoutDashboard,
//   BriefcaseBusiness,
//   BarChart3,
//   FileText,
//   Settings,
//   LogOut,
//   Bell,
//   Menu,
// } from "lucide-react";

// function DashboardLayout() {
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/login");
//   };

//   const navItems = [
//     {
//       name: "Dashboard",
//       path: "/dashboard",
//       icon: LayoutDashboard,
//     },
//     {
//       name: "Applications",
//       path: "/applications",
//       icon: BriefcaseBusiness,
//     },
//     {
//       name: "Analytics",
//       path: "/analytics",
//       icon: BarChart3,
//     },
//     {
//       name: "Resume AI",
//       path: "/resume-ai",
//       icon: FileText,
//     }
//   ];

//   return (
//     <div className="flex min-h-screen bg-slate-50 font-sans text-slate-800">

//       {/* ================= SIDEBAR ================= */}
//       <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white lg:flex">

//         {/* LOGO */}
//         <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-6">
//           <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md">
//             <BriefcaseBusiness className="h-5 w-5" />
//           </div>

//           <div>
//             <h1 className="text-base font-extrabold tracking-tight text-slate-900">
//               JobPilot AI
//             </h1>

//             <p className="mt-1 text-[10px] font-semibold text-slate-400">
//               Career Workspace
//             </p>
//           </div>
//         </div>

//         {/* NAVIGATION */}
//         <nav className="flex-1 space-y-1.5 px-4 py-5">

//           <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
//             Workspace
//           </p>

//           {navItems.map((item) => {
//             const Icon = item.icon;

//             return (
//               <NavLink
//                 key={item.path}
//                 to={item.path}
//                 className={({ isActive }) =>
//                   `flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-xs font-semibold transition ${isActive
//                     ? "bg-indigo-50 text-indigo-600"
//                     : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
//                   }`
//                 }
//               >
//                 <Icon className="h-4 w-4" />
//                 <span>{item.name}</span>
//               </NavLink>
//             );
//           })}
//         </nav>

//         {/* BOTTOM ACTIONS */}
//         <div className="border-t border-slate-100 p-4">

//           <NavLink
//             to="/settings"
//             className={({ isActive }) =>
//               `mb-2 flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-xs font-semibold transition ${isActive
//                 ? "bg-indigo-50 text-indigo-600"
//                 : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
//               }`
//             }
//           >
//             <Settings className="h-4 w-4" />
//             Settings
//           </NavLink>

//           <button
//             onClick={handleLogout}
//             className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-xs font-bold text-rose-500 transition hover:bg-rose-50"
//           >
//             <LogOut className="h-4 w-4" />
//             Logout
//           </button>
//         </div>
//       </aside>

//       {/* ================= MAIN AREA ================= */}
//       <main className="flex min-w-0 flex-1 flex-col">

//         {/* HEADER */}
//         <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-5 md:px-8">

//           <div className="flex items-center gap-3">
//             <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 lg:hidden">
//               <Menu className="h-4 w-4" />
//             </button>

//             <div>
//               <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-600">
//                 JobPilot AI
//               </p>

//               <h2 className="text-sm font-extrabold text-slate-900">
//                 Career Management
//               </h2>
//             </div>
//           </div>

//           <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 transition hover:text-indigo-600">
//             <Bell className="h-4 w-4" />
//           </button>
//         </header>

//         {/* PAGE CONTENT */}
//         <div className="flex-1 overflow-y-auto p-5 md:p-8">
//           <Outlet />
//         </div>
//       </main>
//     </div>
//   );
// }

// export default DashboardLayout;

import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  BriefcaseBusiness,
  BarChart3,
  FileText,
  Settings,
  LogOut,
  Bell,
  Menu,
  X,
} from "lucide-react";

function DashboardLayout() {
  const navigate = useNavigate();

  // =========================
  // MOBILE SIDEBAR STATE
  // =========================
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // =========================
  // NAVIGATION ITEMS
  // =========================
  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Applications",
      path: "/applications",
      icon: BriefcaseBusiness,
    },
    {
      name: "Analytics",
      path: "/analytics",
      icon: BarChart3,
    },
    {
      name: "Resume AI",
      path: "/resume-ai",
      icon: FileText,
    },
  ];

  // =========================
  // SIDEBAR CONTENT
  // =========================
  const SidebarContent = () => (
    <>
      {/* LOGO */}
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 lg:px-6 lg:py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md">
            <BriefcaseBusiness className="h-5 w-5" />
          </div>

          <div>
            <h1 className="text-base font-extrabold tracking-tight text-slate-900">
              JobPilot AI
            </h1>

            <p className="mt-1 text-[10px] font-semibold text-slate-400">
              Career Workspace
            </p>
          </div>
        </div>

        {/* MOBILE CLOSE BUTTON */}
        <button
          type="button"
          onClick={() => setSidebarOpen(false)}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 lg:hidden"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 space-y-1.5 px-4 py-5">
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
          Workspace
        </p>

        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`
              }
            >
              <Icon className="h-4 w-4" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* BOTTOM ACTIONS */}
      <div className="border-t border-slate-100 p-4">
        <NavLink
          to="/settings"
          onClick={() => setSidebarOpen(false)}
          className={({ isActive }) =>
            `mb-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
              isActive
                ? "bg-indigo-50 text-indigo-600"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
            }`
          }
        >
          <Settings className="h-4 w-4" />
          Settings
        </NavLink>

        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-rose-500 transition hover:bg-rose-50"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen overflow-x-hidden bg-slate-50 font-sans text-slate-800">
      {/* =========================
          DESKTOP SIDEBAR
      ========================= */}
      <aside className="hidden min-h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-white lg:flex">
        <SidebarContent />
      </aside>

      {/* =========================
          MOBILE OVERLAY
      ========================= */}
      {sidebarOpen && (
        <button
          type="button"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 cursor-default bg-slate-900/40 lg:hidden"
          aria-label="Close sidebar overlay"
        />
      )}

      {/* =========================
          MOBILE SIDEBAR
      ========================= */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        <SidebarContent />
      </aside>

      {/* =========================
          MAIN AREA
      ========================= */}
      <main className="flex min-w-0 flex-1 flex-col">
        {/* HEADER */}
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-5 md:px-8">
          <div className="flex items-center gap-3">
            {/* MOBILE MENU BUTTON */}
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-indigo-600 lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-600">
                JobPilot AI
              </p>

              <h2 className="text-sm font-extrabold text-slate-900">
                Career Management
              </h2>
            </div>
          </div>

          {/* NOTIFICATION */}
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 shadow-sm transition hover:bg-slate-50 hover:text-indigo-600"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
          </button>
        </header>

        {/* PAGE CONTENT */}
        <div className="flex-1 p-5 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default DashboardLayout;