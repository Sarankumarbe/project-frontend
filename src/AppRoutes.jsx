import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/common/ProtectedRoute";
import UserProtectedRoute from "./components/common/UserProtectedRoute";

// Public Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import HomeCourses from "./pages/HomeCourses";
import Contact from "./pages/Contact";
import AboutUs from "./pages/AboutUs";

// Admin Pages
import AdminDashboard from "./Admin/Pages/AdminDashboard";
import AdminUsers from "./Admin/Pages/AdminUsers";
import AdminCourses from "./Admin/Pages/AdminCourses";
import AdminPayments from "./Admin/Pages/AdminPayments";
import AdminProfile from "./Admin/Pages/AdminProfile";
import AdminCoupons from "./Admin/Pages/AdminCoupons";
import AdminQuestionPaper from "./Admin/Pages/AdminQuestionPaper";
import AddQuestion from "./Admin/Components/AddQuestion";
import ViewQuestion from "./Admin/Components/ViewQuestion";
import EditQuestion from "./Admin/Components/EditQuestion";

// User Pages (add your user pages here)
import UserDashboard from "./User/Pages/UserDashboard";
import UserCourses from "./User/Pages/UserCourses";
import UserTest from "./User/Pages/UserTest";
import UserProfile from "./User/Pages/UserProfile";
import CourseDetail from "./User/Components/CourseDetail";
import UserCart from "./User/Pages/UserCArt";
import UserSubmission from "./User/Pages/UserSubmission";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/home-courses" element={<HomeCourses />} />
      <Route path="/contact" element={<Contact />} />
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
        path="/admin/users"
        element={
          <ProtectedRoute role="admin">
            <AdminUsers />
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
        path="/admin/question-paper"
        element={
          <ProtectedRoute role="admin">
            <AdminQuestionPaper />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/add-question-paper"
        element={
          <ProtectedRoute role="admin">
            <AddQuestion />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/question-papers/:id"
        element={
          <ProtectedRoute role="admin">
            <ViewQuestion />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/edit-question-paper/:id"
        element={
          <ProtectedRoute role="admin">
            <EditQuestion />
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
        path="/admin/coupons"
        element={
          <ProtectedRoute role="admin">
            <AdminCoupons />
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
      <Route
        path="/dashboard"
        element={
          <UserProtectedRoute>
            <UserDashboard />
          </UserProtectedRoute>
        }
      />
      <Route
        path="/user-course"
        element={
          <UserProtectedRoute>
            <UserCourses />
          </UserProtectedRoute>
        }
      />
      <Route
        path="/cart"
        element={
          <UserProtectedRoute>
            <UserCart />
          </UserProtectedRoute>
        }
      />
      <Route
        path="/user-course/:id"
        element={
          <UserProtectedRoute>
            <CourseDetail />
          </UserProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <UserProtectedRoute>
            <UserProfile />
          </UserProtectedRoute>
        }
      />
      <Route
        path="/test/:id"
        element={
          <UserProtectedRoute>
            <UserTest />
          </UserProtectedRoute>
        }
      />
      <Route
        path="/submission/:questionPaperId"
        element={
          <UserProtectedRoute>
            <UserSubmission />
          </UserProtectedRoute>
        }
      />

      {/* 404 Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
