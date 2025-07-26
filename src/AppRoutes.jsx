import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/common/ProtectedRoute";
import UserProtectedRoute from "./components/common/UserProtectedRoute";

// Public Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminLoginPage from "./pages/AdminLoginPage";

// Admin Pages
import AdminDashboard from "./Admin/Pages/AdminDashboard";
import AdminCourses from "./Admin/Pages/AdminCourses";
import AdminPayments from "./Admin/Pages/AdminPayments";
import AdminProfile from "./Admin/Pages/AdminProfile";

// User Pages (add your user pages here)
// import UserDashboard from "./pages/UserDashboard";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* Admin Protected Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/courses"
        element={
          <ProtectedRoute role="admin">
            <AdminCourses />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/payments"
        element={
          <ProtectedRoute role="admin">
            <AdminPayments />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/profile"
        element={
          <ProtectedRoute role="admin">
            <AdminProfile />
          </ProtectedRoute>
        }
      />

      {/* User Protected Routes */}
      {/* <Route
        path="/dashboard"
        element={
          <UserProtectedRoute>
            <UserDashboard />
          </UserProtectedRoute>
        }
      /> */}

      {/* 404 Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
