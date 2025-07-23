import React, { useEffect } from "react";
import { Form, Input, Button, message, Divider, Space } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useUserLoginMutation } from "../../store/api/userApi";
import { useAdminLoginMutation } from "../../store/api/adminApi";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../../store/slices/authSlice";

const LoginForm = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { loading } = useSelector((state) => state.auth);
  const [userLogin] = useUserLoginMutation();
  const [adminLogin] = useAdminLoginMutation();

  const from = location.state?.from?.pathname || "/";

  const onFinish = async (values) => {
    try {
      dispatch(loginStart());

      // Try user login first
      let result;
      try {
        result = await userLogin(values).unwrap();
      } catch (userError) {
        // If user login fails, try admin login
        try {
          result = await adminLogin(values).unwrap();
        } catch (adminError) {
          throw new Error("Invalid credentials");
        }
      }

      dispatch(
        loginSuccess({
          user: result.user,
          token: result.token,
          role: result.role,
        })
      );

      message.success("Login successful!");

      // Redirect based on role
      if (result.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate(from === "/login" ? "/user/dashboard" : from);
      }
    } catch (error) {
      dispatch(loginFailure(error.message || "Login failed"));
      message.error(error.message || "Login failed");
    }
  };

  return (
    <Form
      form={form}
      name="login"
      onFinish={onFinish}
      layout="vertical"
      requiredMark={false}
    >
      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: "Please input your email!" },
          { type: "email", message: "Please enter a valid email!" },
        ]}
      >
        <Input
          prefix={<UserOutlined />}
          placeholder="Enter your email"
          size="large"
        />
      </Form.Item>

      <Form.Item
        name="password"
        label="Password"
        rules={[
          { required: true, message: "Please input your password!" },
          { min: 6, message: "Password must be at least 6 characters!" },
        ]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="Enter your password"
          size="large"
        />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          loading={loading}
          style={{ width: "100%" }}
        >
          Login
        </Button>
      </Form.Item>

      <Divider>Or</Divider>

      <div style={{ textAlign: "center" }}>
        <Space direction="vertical">
          <span>Don't have an account?</span>
          <Link to="/register">
            <Button type="link" size="large">
              Register Now
            </Button>
          </Link>
        </Space>
      </div>
    </Form>
  );
};

export default LoginForm;
