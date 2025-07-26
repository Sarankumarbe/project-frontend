import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import { ConfigProvider } from "antd";
import store from "./store";
import ProtectedRoute from "./components/common/ProtectedRoute";

// Public Pages
import HomePage from "./pages/HomePage";
// import AboutPage from "./pages/AboutPage";
// import ContactPage from "./pages/ContactPage";
// import ServicesPage from "./pages/ServicesPage";
// import CoursesPage from "./pages/CoursesPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminLoginPage from "./pages/AdminLoginPage";

// Admin Pages
import AdminDashboard from "./Admin/Pages/AdminDashboard";
// import CreateCourse from "./pages/admin/CreateCourse";
// import ManageContent from "./pages/admin/ManageContent";
// import ManageUsers from "./pages/admin/ManageUsers";
// import ManagePayments from "./pages/admin/ManagePayments";

// User Pages
// import UserDashboard from "./pages/user/UserDashboard";
// import TakeTest from "./pages/user/TakeTest";
// import TestResults from "./pages/user/TestResults";
// import Profile from "./pages/user/Profile";

const antdTheme = {
  token: {
    colorPrimary: "#1890ff",
    borderRadius: 6,
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
};

function App() {
  return (
    <Provider store={store}>
      <ConfigProvider theme={antdTheme}>
        <Router>
          <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              {/* <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/courses" element={<CoursesPage />} /> */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/admin/login" element={<AdminLoginPage />} />

              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute role="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              {/* <Route
                path="/admin/create-course"
                element={
                  <ProtectedRoute role="admin">
                    <CreateCourse />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/manage-content"
                element={
                  <ProtectedRoute role="admin">
                    <ManageContent />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/manage-users"
                element={
                  <ProtectedRoute role="admin">
                    <ManageUsers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/manage-payments"
                element={
                  <ProtectedRoute role="admin">
                    <ManagePayments />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/user/dashboard"
                element={
                  <ProtectedRoute role="user">
                    <UserDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user/test/:courseId"
                element={
                  <ProtectedRoute role="user">
                    <TakeTest />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user/test-results/:testId"
                element={
                  <ProtectedRoute role="user">
                    <TestResults />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user/profile"
                element={
                  <ProtectedRoute role="user">
                    <Profile />
                  </ProtectedRoute>
                }
              /> */}

              {/* <Route
                path="/admin"
                element={<Navigate to="/admin/dashboard" replace />}
              />
              <Route
                path="/user"
                element={<Navigate to="/user/dashboard" replace />}
              /> */}

              {/* 404 Route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </ConfigProvider>
    </Provider>
  );
}

export default App;
