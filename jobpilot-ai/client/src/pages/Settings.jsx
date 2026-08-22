import { useEffect, useState } from "react";
import api from "../services/api";

import {
  User,
  Bell,
  Lock,
  Save,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

function Settings() {
  // =========================
  // PROFILE STATE
  // =========================
  const [profile, setProfile] = useState({
    name: "",
    email: "",
  });

  // =========================
  // NOTIFICATION STATE
  // =========================
  const [notifications, setNotifications] = useState({
    applicationUpdates: true,
    interviewReminders: true,
    emailNotifications: false,
  });

  // =========================
  // PASSWORD STATE
  // =========================
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  // =========================
  // UI STATES
  // =========================
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // =========================
  // FETCH PROFILE
  // =========================
  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/users/profile");

      const user = response.data.user;

      setProfile({
        name: user?.name || "",
        email: user?.email || "",
      });

      setNotifications({
        applicationUpdates:
          user?.notifications?.applicationUpdates ?? true,

        interviewReminders:
          user?.notifications?.interviewReminders ?? true,

        emailNotifications:
          user?.notifications?.emailNotifications ?? false,
      });
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to load profile settings"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOAD PROFILE
  // =========================
  useEffect(() => {
    fetchProfile();
  }, []);

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
  // PROFILE INPUT CHANGE
  // =========================
  const handleProfileChange = (e) => {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // TOGGLE NOTIFICATIONS
  // =========================
  const handleNotificationChange = (key) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // =========================
  // SAVE SETTINGS
  // =========================
  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      // Basic validation
      if (!profile.name.trim()) {
        setError("Name is required.");
        return;
      }

      if (!profile.email.trim()) {
        setError("Email is required.");
        return;
      }

      // Password validation
      if (
        newPassword.trim() &&
        newPassword.trim().length < 6
      ) {
        setError(
          "New password must contain at least 6 characters."
        );
        return;
      }

      // Base update data
      const updateData = {
        name: profile.name.trim(),
        email: profile.email.trim(),
        notifications,
      };

      // Only send password when user entered one
      if (newPassword.trim()) {
        updateData.password = newPassword.trim();
      }

      const response = await api.put(
        "/users/profile",
        updateData
      );

      // Update frontend data from backend response
      const updatedUser = response.data.user;

      if (updatedUser) {
        setProfile({
          name: updatedUser.name || "",
          email: updatedUser.email || "",
        });

        setNotifications({
          applicationUpdates:
            updatedUser.notifications?.applicationUpdates ??
            notifications.applicationUpdates,

          interviewReminders:
            updatedUser.notifications?.interviewReminders ??
            notifications.interviewReminders,

          emailNotifications:
            updatedUser.notifications?.emailNotifications ??
            notifications.emailNotifications,
        });
      }

      // Clear password field after successful save
      setNewPassword("");

      setSuccess("Settings saved successfully!");
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to save settings"
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // LOADING SCREEN
  // =========================
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />

          <p className="mt-3 text-sm font-medium text-slate-500">
            Loading settings...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl pb-8">
      {/* ================= HEADER ================= */}
      <div className="mb-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-600">
          Account
        </p>

        <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900">
          Settings
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Manage your profile, notifications, security, and account preferences.
        </p>
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

      <div className="space-y-6">
        {/* ================= PROFILE ================= */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-indigo-50 p-3">
              <User className="h-5 w-5 text-indigo-600" />
            </div>

            <div>
              <h2 className="font-bold text-slate-900">
                Profile Information
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Update your personal account details.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* NAME */}
            <div>
              <label className="mb-2 block text-xs font-bold text-slate-700">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleProfileChange}
                placeholder="Enter your full name"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="mb-2 block text-xs font-bold text-slate-700">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleProfileChange}
                placeholder="Enter your email"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>
        </section>

        {/* ================= NOTIFICATIONS ================= */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-amber-50 p-3">
              <Bell className="h-5 w-5 text-amber-600" />
            </div>

            <div>
              <h2 className="font-bold text-slate-900">
                Notifications
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Choose how JobPilot AI keeps you informed.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {[
              {
                key: "applicationUpdates",
                title: "Application Updates",
                description:
                  "Receive updates about your job applications.",
              },
              {
                key: "interviewReminders",
                title: "Interview Reminders",
                description:
                  "Get reminders for upcoming interviews.",
              },
              {
                key: "emailNotifications",
                title: "Email Notifications",
                description:
                  "Receive important updates by email.",
              },
            ].map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 p-4 transition hover:bg-slate-50"
              >
                <div>
                  <p className="text-sm font-bold text-slate-800">
                    {item.title}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {item.description}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    handleNotificationChange(item.key)
                  }
                  aria-label={`Toggle ${item.title}`}
                  className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                    notifications[item.key]
                      ? "bg-indigo-600"
                      : "bg-slate-200"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-all ${
                      notifications[item.key]
                        ? "left-6"
                        : "left-1"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* ================= SECURITY ================= */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-rose-50 p-3">
              <Lock className="h-5 w-5 text-rose-600" />
            </div>

            <div>
              <h2 className="font-bold text-slate-900">
                Security
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Change your account password securely.
              </p>
            </div>
          </div>

          <div className="max-w-md">
            <label className="mb-2 block text-xs font-bold text-slate-700">
              New Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(e.target.value)
                }
                placeholder="Leave empty to keep current password"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-12 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword((prev) => !prev)
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-indigo-600"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            <p className="mt-2 text-[11px] text-slate-400">
              Leave this field empty if you do not want to change your password.
            </p>
          </div>
        </section>

        {/* ================= SAVE ================= */}
        <div className="flex justify-end border-t border-slate-200 pt-6">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}

            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;