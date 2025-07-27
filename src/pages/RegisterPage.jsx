import React from "react";
import AuthLayout from "../components/auth/AuthLayout";
import RegisterForm from "../components/auth/RegisterForm";
import MainPageLayout from "../layouts/MainPageLayout";

const RegisterPage = () => {
  return (
    <MainPageLayout isAuthPage={true}>
      <AuthLayout title="Create Account">
        <RegisterForm />
      </AuthLayout>
    </MainPageLayout>
  );
};

export default RegisterPage;
