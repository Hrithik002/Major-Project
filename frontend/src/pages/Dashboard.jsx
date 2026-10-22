import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import {
  FaArrowRight,
  FaBolt,
  FaChartLine,
  FaCloud,
  FaLightbulb,
  FaRobot,
  FaRupeeSign,
  FaSearch,
  FaShoppingCart,
} from "react-icons/fa";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
);

const SEARCH_TARGETS = [
  { label: "Weather Intelligence", path: "/weather", keywords: ["weather", "forecast", "rain"] },
  { label: "Market Prices", path: "/market-prices", keywords: ["market", "price", "mandi"] },
  { label: "Digital Marketplace", path: "/marketplace", keywords: ["marketplace", "buy", "sell", "shop"] },
  { label: "Smart Recommendations", path: "/knowledge-hub", keywords: ["recommendations", "advice", "tips", "knowledge"] },
  { label: "Chatbot", path: "/chatbot", keywords: ["chat", "assistant", "bot"] },
];

const Dashboard = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || "dark");

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(document.documentElement.dataset.theme || "dark");
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  const colors = useMemo(
    () =>
      theme === "dark"
        ? {
            text: "#e5e7eb",
            muted: "#b6bfba",
            grid: "rgba(148, 163, 184, 0.14)",
            teal: "rgba(15, 118, 110, 0.92)",
            emerald: "rgba(16, 185, 129, 0.92)",
            gold: "rgba(212, 163, 115, 0.92)",
            coral: "rgba(236, 139, 114, 0.92)",
          }
        : {
            text: "#0f172a",
            muted: "#64748b",
            grid: "rgba(148, 163, 184, 0.22)",
            teal: "rgba(15, 118, 110, 0.9)",
            emerald: "rgba(16, 185, 129, 0.9)",
            gold: "rgba(212, 163, 115, 0.9)",
            coral: "rgba(236, 139, 114, 0.9)",
          },
    [theme]
  );

  const featureCards = [
    { name: "Weather Intelligence", icon: <FaCloud className="text-3xl" />, description: "Real-time weather data, rainfall patterns, and forecasting insights.", path: "/weather", accent: "from-teal-500/20 to-emerald-500/10", iconTint: "text-teal-400" },
    { name: "Smart Recommendations", icon: <FaLightbulb className="text-3xl" />, description: "Actionable guidance for crops, planning, and field decisions.", path: "/knowledge-hub", accent: "from-amber-500/20 to-rose-500/10", iconTint: "text-amber-400" },
    { name: "Market Insights", icon: <FaChartLine className="text-3xl" />, description: "Track price trends and market movement with visual analytics.", path: "/market-prices", accent: "from-gold-500/20 to-amber-500/10", iconTint: "text-amber-300" },
    { name: "Digital Marketplace", icon: <FaShoppingCart className="text-3xl" />, description: "Buy and sell produce with a polished, trusted marketplace flow.", path: "/marketplace", accent: "from-coral-500/20 to-orange-500/10", iconTint: "text-rose-300" },
  ];

  const quickActions = [
    { label: "Weather", path: "/weather", icon: <FaCloud /> },
    { label: "Prices", path: "/market-prices", icon: <FaRupeeSign /> },
    { label: "Marketplace", path: "/marketplace", icon: <FaShoppingCart /> },
    { label: "Chatbot", path: "/chatbot", icon: <FaRobot /> },
  ];

  const stats = [
    { label: "Active Farmers", value: "1000+" },
    { label: "Crop Listings", value: "500+" },
    { label: "Daily Market Updates", value: "100+" },
    { label: "Government Schemes", value: "50+" },
  ];

  const weatherChartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Rainfall (mm)",
        data: [8, 10, 14, 9, 12, 16, 11],
        borderColor: colors.teal,
        backgroundColor: "rgba(15, 118, 110, 0.12)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const marketChartData = {
    labels: ["Rice", "Wheat", "Maize", "Tomato", "Onion"],
    datasets: [
      {
        label: "Price Index",
        data: [74, 68, 82, 79, 72],
        backgroundColor: [colors.teal, colors.emerald, colors.gold, colors.coral, "rgba(216, 180, 122, 0.55)"],
        borderRadius: 12,
      },
    ],
  };

  const recommendationChartData = {
    labels: ["Crop Tips", "Pest Alerts", "Irrigation", "Market Timing"],
    datasets: [
      {
        data: [34, 21, 27, 18],
        backgroundColor: [colors.teal, colors.emerald, colors.gold, colors.coral],
        borderWidth: 0,
      },
    ],
  };

  const handleSearch = () => {
    const normalized = searchQuery.trim().toLowerCase();
    if (!normalized) return;
    const match = SEARCH_TARGETS.find((item) => item.keywords.some((k) => normalized.includes(k)));
    navigate(match?.path || "/dashboard");
  };

  return (
    <div className="w-full space-y-6 transition-colors duration-300">
      <div className="space-y-6">
        <section className="terra-panel relative overflow-hidden rounded-[32px] p-6 shadow-2xl sm:p-8 lg:p-10">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-10 top-0 h-56 w-56 rounded-full bg-teal-500/15 blur-3xl" />
            <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />
          </div>

          <div className="relative grid gap-6 lg:grid-cols-[1.2fr,0.8fr] lg:items-start">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--app-border)] bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-[var(--app-text-muted)]">
                <span className="h-2 w-2 rounded-full bg-teal-500" /> Terra Connect Dashboard
              </div>
              <div className="max-w-3xl space-y-4">
                <h1 className="text-4xl font-semibold tracking-tight text-[var(--app-text)] sm:text-5xl lg:text-6xl">Welcome to Terra Connect</h1>
                <p className="max-w-2xl text-base leading-7 text-[var(--app-text-soft)] sm:text-lg">Your complete agricultural advisory and marketplace platform</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                <label className="relative block">
                  <span className="sr-only">Global search</span>
                  <FaSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--app-text-muted)]" />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    aria-label="Search Terra Connect"
                    placeholder="Search weather, market prices, marketplace, chatbot..."
                    className="terra-input w-full rounded-2xl py-3 pl-11 pr-4 text-sm font-medium placeholder:text-[var(--app-text-muted)]"
                  />
                </label>

                <button
                  type="button"
                  onClick={handleSearch}
                  className="terra-button inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-700 to-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-500/20 transition-all duration-300 hover:-translate-y-0.5"
                >
                  Search
                  <FaArrowRight />
                </button>
              </div>

              <div className="flex flex-wrap gap-3">
                {quickActions.map((action) => (
                  <Link
                    key={action.path}
                    to={action.path}
                    className="terra-link inline-flex items-center gap-2 rounded-full border border-[var(--app-border)] bg-white/5 px-4 py-2 text-sm font-medium text-[var(--app-text)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-teal-500/30"
                  >
                    <span className="text-teal-400">{action.icon}</span>
                    {action.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="terra-card rounded-[28px] p-5 sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--app-text-muted)]">Quick access</p>
              <div className="mt-4 space-y-3">
                {[
                  { label: "Weather Intelligence", path: "/weather", icon: <FaCloud className="text-sky-400" /> },
                  { label: "Market Insights", path: "/market-prices", icon: <FaRupeeSign className="text-amber-400" /> },
                  { label: "Digital Marketplace", path: "/marketplace", icon: <FaShoppingCart className="text-emerald-400" /> },
                ].map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="terra-link flex items-center justify-between rounded-2xl border border-[var(--app-border)] bg-white/5 px-4 py-3 text-sm text-[var(--app-text)] transition-all duration-300 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-teal-500/30"
                  >
                    <span className="flex items-center gap-3">{item.icon}{t(item.label)}</span>
                    <FaArrowRight className="text-[var(--app-text-muted)]" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--app-text-muted)]">Analytics overview</p>
              <h2 className="mt-2 text-2xl font-semibold text-[var(--app-text)] sm:text-3xl">Weather, market, and recommendation insights</h2>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-3 items-stretch">
            <div className="terra-card h-full rounded-[28px] p-5 sm:p-6 lg:col-span-2">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-[var(--app-text)]">Weather trend</h3>
                  <p className="text-sm text-[var(--app-text-muted)]">Weekly rainfall and forecast pattern</p>
                </div>
                <span className="rounded-full border border-[var(--app-border)] bg-white/5 px-3 py-1 text-xs font-medium text-[var(--app-text-muted)]">Live style preview</span>
              </div>
              <div className="h-72"><Line data={weatherChartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: colors.text, font: { family: "Inter" } } } }, scales: { x: { ticks: { color: colors.muted }, grid: { color: colors.grid } }, y: { ticks: { color: colors.muted }, grid: { color: colors.grid } } } }} /></div>
            </div>

            <div className="terra-card h-full rounded-[28px] p-5 sm:p-6">
              <h3 className="text-lg font-semibold text-[var(--app-text)]">Recommendations</h3>
              <p className="text-sm text-[var(--app-text-muted)]">What users are reading most</p>
              <div className="mt-4 h-72"><Doughnut data={recommendationChartData} options={{ responsive: true, maintainAspectRatio: false, cutout: "68%", plugins: { legend: { position: "bottom", labels: { color: colors.text, boxWidth: 12 } } } }} /></div>
            </div>

            <div className="terra-card h-full rounded-[28px] p-5 sm:p-6 lg:col-span-3">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-[var(--app-text)]">Market insights</h3>
                  <p className="text-sm text-[var(--app-text-muted)]">Price index across key crops</p>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full border border-[var(--app-border)] bg-white/5 px-3 py-1 text-xs font-medium text-[var(--app-text-muted)]"><FaBolt className="text-amber-400" /> Updated daily</span>
              </div>
              <div className="h-72"><Bar data={marketChartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { ticks: { color: colors.muted }, grid: { color: colors.grid } }, y: { ticks: { color: colors.muted }, grid: { color: colors.grid }, suggestedMax: 100 } } }} /></div>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--app-text-muted)]">Core platform modules</p>
              <h2 className="mt-2 text-2xl font-semibold text-[var(--app-text)] sm:text-3xl">Modern tools designed for fast decisions</h2>
            </div>
          </div>

          <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))] auto-rows-fr items-stretch">
            {featureCards.map((feature, idx) => (
              <Link key={feature.path} to={feature.path} className={`terra-card group relative flex h-full flex-col overflow-hidden rounded-[28px] p-6 transition-all duration-300 hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-teal-500/30 ${feature.accent}`} style={{ animationDelay: `${idx * 60}ms` }}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="relative flex h-full flex-col space-y-4">
                  <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 ${feature.iconTint}`}>{feature.icon}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--app-text)]">{t(feature.name)}</h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--app-text-muted)]">{t(feature.description)}</p>
                  </div>
                  <div className="mt-auto pt-2 text-sm font-medium text-amber-400 transition-transform duration-300 group-hover:translate-x-1">Explore module →</div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="terra-panel rounded-[32px] p-6 sm:p-8">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((item) => (
              <div key={item.label} className="terra-card rounded-[24px] px-5 py-6 text-center">
                <p className="text-3xl font-semibold tracking-tight text-[var(--app-text)] sm:text-4xl">{item.value}</p>
                <p className="mt-2 text-sm text-[var(--app-text-muted)]">{t(item.label)}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
