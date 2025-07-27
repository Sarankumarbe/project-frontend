import React from "react";
import AuthLayout from "../components/auth/AuthLayout";
import LoginForm from "../components/auth/LoginForm";
import MainPageLayout from "../layouts/MainPageLayout";

const LoginPage = () => {
  return (
    <MainPageLayout isAuthPage={true}>
      <AuthLayout title="Welcome Back">
        <LoginForm />
      </AuthLayout>
    </MainPageLayout>
  );
};

export default LoginPage;
