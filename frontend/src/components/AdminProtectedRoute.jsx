import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { isTokenValid, getUserRole } from "../utils/auth";

const AdminProtectedRoute = ({ children }) => {
  const location = useLocation();
  const tokenOk = isTokenValid();
  const userRole = getUserRole();

  if (!tokenOk) {
    toast.error("Please login to access this page");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (userRole !== "admin") {
    toast.error("You don't have permission to access the admin dashboard");
    return <Navigate to="/dashboard" replace />;
  }

  // Admin pages don't need AppLayout (no navbar for admin)
  return children;
};

export default AdminProtectedRoute;
