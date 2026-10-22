import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import AuthLayout from "./layouts/AuthLayout";
import AppLayout from "./layouts/AppLayout";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Weather from "./pages/Weather";
import PestDetection from "./pages/PestDetection";
import Chatbot from "./pages/Chatbot";
import MarketPrices from "./pages/MarketPrices";
import GovernmentSchemes from "./pages/GovernmentSchemes";
import Marketplace from "./pages/Marketplace";
import BuyerPage from "./pages/BuyerPage";
import Forum from "./pages/Forum";
import KnowledgeHub from "./pages/KnowledgeHub";
import Profile from "./pages/Profile";
import FertilizerAlerts from "./pages/FertilizerAlerts";
import { Toaster } from "react-hot-toast";
import { getUserRole, isTokenValid } from "./utils/auth";
import { LanguageProvider } from "./contexts/LanguageContext";
import { CartProvider } from "./contexts/CartContext";

function App() {
  const isAuthenticated = () => isTokenValid();
  const getDefaultRoute = () => {
    const role = getUserRole();
    if (role === "admin") return "/admin/dashboard";
    if (role === "buyer") return "/buyer";
    return "/dashboard";
  };

  return (
    <LanguageProvider>
      <CartProvider>
        <Router>
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "var(--app-surface-strong)",
                color: "var(--app-text)",
                border: "1px solid var(--app-border)",
                boxShadow: "var(--app-shadow)",
              },
              success: {
                iconTheme: {
                  primary: "#0f766e",
                  secondary: "#ffffff",
                },
              },
              error: {
                iconTheme: {
                  primary: "#d66a52",
                  secondary: "#ffffff",
                },
              },
            }}
          />
          <Routes>
          {/* Public Routes - No Navbar */}
          <Route
            path="/login"
            element={
              isAuthenticated() ? (
                <Navigate to={getDefaultRoute()} replace />
              ) : (
                <AuthLayout>
                  <Login />
                </AuthLayout>
              )
            }
          />
          <Route
            path="/register"
            element={
              isAuthenticated() ? (
                <Navigate to={getDefaultRoute()} replace />
              ) : (
                <AuthLayout>
                  <Register />
                </AuthLayout>
              )
            }
          />

          {/* Protected Routes - Navbar Always Visible */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Profile />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/weather"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Weather />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/market-prices"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <MarketPrices />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/schemes"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <GovernmentSchemes />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/marketplace"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Marketplace />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/buyer"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <BuyerPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/forum"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Forum />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/knowledge-hub"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <KnowledgeHub />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/pest-detection"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <PestDetection />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/fertilizer-alerts"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <FertilizerAlerts />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/chatbot"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Chatbot />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          {/* Admin Routes - No App Layout */}
          <Route
            path="/admin/dashboard"
            element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            }
          />

          {/* Default Route */}
          <Route
            path="/"
            element={
              <Navigate
                to={isAuthenticated() ? getDefaultRoute() : "/login"}
                replace
              />
            }
          />

          {/* Catch all - redirect to dashboard or login */}
          <Route
            path="*"
            element={
              <Navigate
                to={isAuthenticated() ? getDefaultRoute() : "/login"}
                replace
              />
            }
          />
          </Routes>
        </Router>
      </CartProvider>
    </LanguageProvider>
  );
}

export default App;
