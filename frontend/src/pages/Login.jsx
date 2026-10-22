import React, { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import api from "../utils/api";
import toast from "react-hot-toast";
import {
  FaArrowRight,
  FaEnvelope,
  FaLeaf,
  FaLock,
  FaMoon,
  FaSun,
} from "react-icons/fa";

const THEME_STORAGE_KEY = "terra-connect-theme";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "", role: "farmer" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme) {
      return savedTheme === "dark";
    }

    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  const navigate = useNavigate();
  const location = useLocation();

  // Get the page user was trying to access, default to dashboard
  const from = location.state?.from?.pathname || "/dashboard";

  useEffect(() => {
    document.title = "Terra Connect | Login";
  }, []);

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, darkMode ? "dark" : "light");
    document.documentElement.style.colorScheme = darkMode ? "dark" : "light";
  }, [darkMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email: formData.email.toLowerCase(),
        password: formData.password,
        role: formData.role,
      });

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        toast.success("Welcome back to Terra Connect!");

        // Redirect based on authenticated user role
        const userRole = response.data?.user?.role || formData.role;
        if (userRole === "admin") {
          navigate("/admin/dashboard", { replace: true });
        } else if (userRole === "buyer") {
          navigate("/buyer", { replace: true });
        } else {
          navigate(from === "/login" ? "/dashboard" : from, { replace: true });
        }
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Login failed. Please try again.";
      toast.error(errorMessage);

      // Set specific field errors if needed
      if (errorMessage.includes("email")) {
        setErrors((prev) => ({ ...prev, email: errorMessage }));
      } else if (errorMessage.includes("password")) {
        setErrors((prev) => ({ ...prev, password: errorMessage }));
      }
    } finally {
      setLoading(false);
    }
  };

  const pageClasses = darkMode
    ? "bg-[#101412] text-slate-100"
    : "bg-[#f7f2e8] text-slate-900";

  const cardClasses = darkMode
    ? "border-white/10 bg-slate-950/75 shadow-[0_30px_80px_-30px_rgba(6,10,9,0.85)]"
    : "border-slate-200/80 bg-white/80 shadow-[0_30px_80px_-30px_rgba(15,118,110,0.18)]";

  const inputClasses = darkMode
    ? "border-white/10 bg-white/5 text-white placeholder:text-slate-500 focus:border-teal-400 focus:bg-white/10"
    : "border-slate-200 bg-slate-50/80 text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:bg-white";

  return (
    <div className={`relative min-h-screen overflow-hidden transition-colors duration-500 ${pageClasses}`}>
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-teal-500/20 blur-3xl" />
        <div className="absolute right-0 top-10 h-80 w-80 rounded-full bg-amber-500/15 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-rose-500/10 blur-3xl" />
      </div>

      <button
        type="button"
        onClick={() => setDarkMode((prev) => !prev)}
        aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        className={`absolute right-6 top-6 z-20 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium shadow-lg backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl ${
          darkMode
            ? "border-white/10 bg-white/5 text-white hover:bg-white/10"
            : "border-slate-200 bg-white/90 text-slate-700 hover:bg-white"
        }`}
      >
        {darkMode ? <FaSun /> : <FaMoon />}
        <span>{darkMode ? "Light" : "Dark"} Mode</span>
      </button>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-14 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center animate-fadeIn">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-700 to-emerald-500 shadow-lg shadow-teal-500/25 transition-transform duration-300 hover:scale-105">
              <FaLeaf className="h-7 w-7 text-white" />
            </div>
            <h1 className={`text-4xl font-semibold tracking-tight sm:text-5xl ${darkMode ? "text-white" : "text-slate-900"}`}>
              Terra Connect
            </h1>
            <p className={`mt-3 text-sm sm:text-base ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
              Secure access for farmers, buyers, and partners.
            </p>
          </div>

          {/* Login Card */}
          <div
            className={`mt-8 rounded-[28px] border p-8 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 ${cardClasses}`}
          >
            <div className="mb-8 text-center">
              <h2 className={`text-2xl font-semibold ${darkMode ? "text-white" : "text-slate-900"}`}>
                Sign in to your account
              </h2>
              <p className={`mt-2 text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                Minimal, secure, and built for a seamless return.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Role Selector */}
              <div>
                <label
                  htmlFor="role"
                  className={`mb-2 block text-sm font-medium ${darkMode ? "text-slate-200" : "text-slate-700"}`}
                >
                  Login As
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className={`block w-full rounded-2xl border py-3 px-4 outline-none transition-all duration-300 text-slate-900 ${inputClasses}`}
                >
                  <option value="farmer" className="text-slate-900">Farmer</option>
                  <option value="buyer" className="text-slate-900">Buyer</option>
                  <option value="expert" className="text-slate-900">Expert</option>
                  <option value="admin" className="text-slate-900">Admin</option>
                </select>
              </div>

              {/* Email Input */}
              <div>
                <label
                  htmlFor="email"
                  className={`mb-2 block text-sm font-medium ${darkMode ? "text-slate-200" : "text-slate-700"}`}
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <FaEnvelope className={darkMode ? "h-5 w-5 text-slate-500" : "h-5 w-5 text-slate-400"} />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`block w-full rounded-2xl border py-3 pl-12 pr-4 outline-none transition-all duration-300 ${inputClasses} ${errors.email ? "border-red-500 focus:border-red-500" : ""}`}
                    placeholder="you@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              {/* Password Input */}
              <div>
                <label
                  htmlFor="password"
                  className={`mb-2 block text-sm font-medium ${darkMode ? "text-slate-200" : "text-slate-700"}`}
                >
                  Password
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <FaLock className={darkMode ? "h-5 w-5 text-slate-500" : "h-5 w-5 text-slate-400"} />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`block w-full rounded-2xl border py-3 pl-12 pr-4 outline-none transition-all duration-300 ${inputClasses} ${errors.password ? "border-red-500 focus:border-red-500" : ""}`}
                    placeholder="Enter your password"
                  />
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-700 to-emerald-500 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-teal-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-teal-500/25 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-3">
                    <svg
                      className="h-5 w-5 animate-spin text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2">
                    Sign In
                    <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-0.5" />
                  </span>
                )}
              </button>
            </form>

            {/* Register Link */}
            <div className="pt-6 text-center">
              <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                Don&apos;t have an account?{" "}
                <Link
                  to="/register"
                  className="font-semibold text-teal-700 transition-all duration-300 hover:text-teal-600 hover:underline"
                >
                  Register here
                </Link>
              </p>
            </div>
          </div>

          {/* Footer */}
          <p className={`mt-6 text-center text-xs ${darkMode ? "text-slate-500" : "text-slate-500"}`}>
            Secure login • Your data is encrypted
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
