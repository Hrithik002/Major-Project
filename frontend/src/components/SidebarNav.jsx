import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useLanguage } from "../contexts/LanguageContext";
import {
  FaBars,
  FaBook,
  FaCloud,
  FaChevronDown,
  FaComments,
  FaBug,
  FaHome,
  FaLeaf,
  FaLanguage,
  FaMoon,
  FaRobot,
  FaRupeeSign,
  FaSignOutAlt,
  FaShoppingCart,
  FaSun,
  FaTimes,
  FaUserCircle,
} from "react-icons/fa";

const THEME_STORAGE_KEY = "terra-connect-theme";

const SidebarNav = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(true);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === "undefined") return false;
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored) return stored === "dark";
    return window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ?? false;
  });

  const navigate = useNavigate();
  const location = useLocation();
  const { language, switchLanguage, t } = useLanguage();

  const featureLinks = useMemo(
    () => [
      { label: "Weather Intelligence", icon: <FaCloud />, path: "/weather" },
      { label: "Market Prices", icon: <FaRupeeSign />, path: "/market-prices" },
      { label: "Fertilizer Alerts", icon: <FaLeaf />, path: "/fertilizer-alerts" },
      { label: "Marketplace", icon: <FaShoppingCart />, path: "/marketplace" },
      { label: "Buyer Page", icon: <FaShoppingCart />, path: "/buyer" },
      { label: "Government Schemes", icon: <FaBook />, path: "/schemes" },
      { label: "Pest Detection", icon: <FaBug />, path: "/pest-detection" },
    ],
    []
  );

  const navLinks = useMemo(
    () => [
      { label: "Dashboard", icon: <FaHome />, path: "/dashboard" },
      { label: "Community Forum", icon: <FaComments />, path: "/forum" },
      { label: "Chatbot", icon: <FaRobot />, path: "/chatbot" },
      { label: "Knowledge Hub", icon: <FaBook />, path: "/knowledge-hub" },
    ],
    []
  );

  useEffect(() => {
    const theme = darkMode ? "dark" : "light";
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  }, [darkMode]);

  useEffect(() => {
    setMobileOpen(false);
    setLanguageOpen(false);
    setAccountOpen(true);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  const linkClasses = (active) =>
    `terra-link group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-teal-500/30 ${
      active
        ? "bg-gradient-to-r from-teal-700/95 to-emerald-600/95 text-white shadow-lg shadow-teal-500/20"
        : "text-[var(--app-text-soft)] hover:bg-white/5 hover:text-[var(--app-text)]"
    }`;

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between border-b border-[var(--app-border)] bg-[var(--app-surface-strong)] px-4 backdrop-blur-2xl lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="terra-button inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--app-border)] bg-white/5 text-[var(--app-text)] transition-all duration-300 hover:-translate-y-0.5"
          aria-label="Open navigation menu"
        >
          <FaBars />
        </button>

        <Link
          to="/dashboard"
          className="flex items-center gap-2 font-semibold tracking-tight text-[var(--app-text)]"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-700 to-emerald-500 text-white shadow-lg shadow-teal-500/20">
            <FaLeaf />
          </span>
          <span className="text-lg">Terra Connect</span>
        </Link>

        <button
          type="button"
          onClick={() => setDarkMode((prev) => !prev)}
          className="terra-button inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--app-border)] bg-white/5 text-[var(--app-text)] transition-all duration-300 hover:-translate-y-0.5"
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
      </header>

      <button
        type="button"
        aria-label="Close navigation menu"
        onClick={() => setMobileOpen(false)}
        className={`fixed inset-0 z-40 bg-slate-950/50 transition-opacity duration-300 lg:hidden ${
          mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        role="navigation"
        aria-label="Terra Connect sidebar"
        className={`terra-panel-strong fixed inset-y-0 left-0 z-50 flex w-[250px] flex-col border-r border-[var(--app-border)] px-4 py-4 transition-transform duration-300 ease-out lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 rounded-2xl px-2 py-2 text-left outline-none transition-transform duration-300 hover:scale-[1.01] focus-visible:ring-2 focus-visible:ring-teal-500/30"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-700 to-emerald-500 text-white shadow-lg shadow-teal-500/20">
              <FaLeaf />
            </span>
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-[var(--app-text-muted)]">
                Terra Connect
              </p>
              <h1 className="text-lg font-semibold text-[var(--app-text)]">
                Agricultural Command Center
              </h1>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="terra-button inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--app-border)] bg-white/5 text-[var(--app-text)] transition-all duration-300 hover:-translate-y-0.5 lg:hidden"
            aria-label="Close navigation menu"
          >
            <FaTimes />
          </button>
        </div>

        <div className="terra-divider mb-4" />

        <button
          type="button"
          onClick={() => setDarkMode((prev) => !prev)}
          className="terra-button mb-4 flex items-center justify-between rounded-2xl border border-[var(--app-border)] bg-white/5 px-4 py-3 text-sm font-medium text-[var(--app-text)] transition-all duration-300 hover:-translate-y-0.5"
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          <span className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-700 to-emerald-500 text-white shadow-lg shadow-teal-500/20">
              {darkMode ? <FaSun /> : <FaMoon />}
            </span>
            <span>
              {darkMode ? "Light Mode" : "Dark Mode"}
              <span className="block text-xs text-[var(--app-text-muted)]">
                Smooth appearance transition
              </span>
            </span>
          </span>
        </button>

        <nav className="flex flex-1 flex-col justify-center space-y-3 overflow-y-auto pr-1" aria-label="Primary navigation">
          {navLinks.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              aria-current={isActive(item.path) ? "page" : undefined}
              className={linkClasses(isActive(item.path))}
            >
              <span className="text-base">{item.icon}</span>
              <span>{t(item.label)}</span>
            </Link>
          ))}

          <button
            type="button"
            onClick={() => setFeaturesOpen((prev) => !prev)}
            className="terra-button group flex w-full items-center justify-between rounded-2xl border border-[var(--app-border)] bg-white/5 px-4 py-3 text-left text-sm font-medium text-[var(--app-text)] transition-all duration-300 hover:-translate-y-0.5"
            aria-expanded={featuresOpen}
          >
            <span className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl terra-icon-surface">
                <FaHome />
              </span>
              <span>{t("Features")}</span>
            </span>
            <FaChevronDown
              className={`transition-transform duration-300 ${featuresOpen ? "rotate-180" : ""}`}
            />
          </button>

          <div
            className={`grid overflow-hidden transition-all duration-300 ${
              featuresOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-80"
            }`}
          >
            <div className="sidebar-scroll min-h-0 max-h-56 space-y-2 overflow-y-auto pl-2 pr-1 pt-2">
              {featureLinks.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  aria-current={isActive(item.path) ? "page" : undefined}
                  className={`terra-link flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-all duration-300 focus-visible:ring-2 focus-visible:ring-teal-500/30 ${
                    isActive(item.path)
                      ? "bg-white/10 text-[var(--app-text)]"
                      : "text-[var(--app-text-muted)] hover:bg-white/5 hover:text-[var(--app-text)]"
                  }`}
                >
                  <span className="text-base terra-accent-text">{item.icon}</span>
                  <span>{t(item.label)}</span>
                </Link>
              ))}
            </div>
          </div>
        </nav>

        <div className="terra-divider my-5" />

        <section className="space-y-3" aria-label="Language selection">
          <button
            type="button"
            onClick={() => setLanguageOpen((prev) => !prev)}
            className="terra-button flex w-full items-center justify-between rounded-2xl border border-[var(--app-border)] bg-white/5 px-4 py-3 text-sm font-medium text-[var(--app-text)] transition-all duration-300 hover:-translate-y-0.5"
            aria-expanded={languageOpen}
          >
            <span className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl terra-icon-surface">
                <FaLanguage />
              </span>
              <span>{t("Language")}</span>
            </span>
            <FaChevronDown
              className={`transition-transform duration-300 ${languageOpen ? "rotate-180" : ""}`}
            />
          </button>

          <div
            className={`grid overflow-hidden transition-all duration-300 ${
              languageOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-80"
            }`}
          >
            <div className="min-h-0 space-y-2 pl-2 pt-2">
              <button
                type="button"
                onClick={() => switchLanguage("english")}
                className={`terra-button w-full rounded-2xl px-4 py-3 text-left text-sm transition-all duration-300 ${
                  language === "english"
                    ? "bg-gradient-to-r from-teal-700 to-emerald-500 text-white shadow-lg shadow-teal-500/20"
                    : "bg-white/5 text-[var(--app-text-muted)] hover:bg-white/10 hover:text-[var(--app-text)]"
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => switchLanguage("kannada")}
                className={`terra-button w-full rounded-2xl px-4 py-3 text-left text-sm transition-all duration-300 ${
                  language === "kannada"
                    ? "bg-gradient-to-r from-teal-700 to-emerald-500 text-white shadow-lg shadow-teal-500/20"
                    : "bg-white/5 text-[var(--app-text-muted)] hover:bg-white/10 hover:text-[var(--app-text)]"
                }`}
                style={{ fontFamily: "Noto Sans Kannada, sans-serif" }}
              >
                ಕನ್ನಡ
              </button>
            </div>
          </div>
        </section>

        <div className="terra-divider my-5" />

        <section className="space-y-3" aria-label="Account actions">
          <button
            type="button"
            onClick={() => setAccountOpen((prev) => !prev)}
            className="terra-button flex w-full items-center justify-between rounded-2xl border border-[var(--app-border)] bg-white/5 px-4 py-3 text-sm font-medium text-[var(--app-text)] transition-all duration-300 hover:-translate-y-0.5"
            aria-expanded={accountOpen}
          >
            <span className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl terra-icon-surface">
                <FaUserCircle />
              </span>
              <span>{t("Account")}</span>
            </span>
            <FaChevronDown
              className={`transition-transform duration-300 ${accountOpen ? "rotate-180" : ""}`}
            />
          </button>

          <div
            className={`grid overflow-hidden transition-all duration-300 ${
              accountOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-80"
            }`}
          >
            <div className="min-h-0 space-y-2 pl-2 pt-2">
              <Link
                to="/profile"
                onClick={() => setMobileOpen(false)}
                aria-current={isActive("/profile") ? "page" : undefined}
                className={`terra-link flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-all duration-300 focus-visible:ring-2 focus-visible:ring-teal-500/30 ${
                  isActive("/profile")
                    ? "bg-white/10 text-[var(--app-text)]"
                    : "text-[var(--app-text-muted)] hover:bg-white/5 hover:text-[var(--app-text)]"
                }`}
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl terra-icon-surface">
                  <FaUserCircle />
                </span>
                <span>{t("Profile")}</span>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="terra-button flex w-full items-center gap-3 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-300 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-500/20 transition-all duration-300 hover:-translate-y-0.5"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10">
                  <FaSignOutAlt />
                </span>
                <span>{t("Logout")}</span>
              </button>
            </div>
          </div>
        </section>
      </aside>
    </>
  );
};

export default SidebarNav;
