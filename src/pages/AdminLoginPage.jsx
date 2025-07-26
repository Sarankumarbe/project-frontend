import React from "react";
import AuthLayout from "../components/auth/AuthLayout";
import AdminLoginForm from "../components/auth/AdminLoginForm";

const AdminLoginPage = () => {
  return (
    <AuthLayout title="Welcome Back">
      <AdminLoginForm />
    </AuthLayout>
  );
};

export default AdminLoginPage;
