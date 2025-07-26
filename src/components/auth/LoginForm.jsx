import React from "react";
import { Form, Input, Button, message, Divider, Space } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useUserLoginMutation } from "../../store/api/userApi";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../../store/slices/authSlice";
import { setCookie } from "../../utils/cookies";

const LoginForm = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [userLogin] = useUserLoginMutation();

  const from = location.state?.from?.pathname || "/user/dashboard";

  const onFinish = async (values) => {
    try {
      dispatch(loginStart());
      const result = await userLogin(values).unwrap();

      // Verify the user role
      if (result.user.role !== "user") {
        throw new Error("Access denied. Please use the admin login page.");
      }

      // Set the token in cookies
      setCookie("token", result.token, 1); // Expires in 1 day

      dispatch(
        loginSuccess({
          user: result.user,
        })
      );

      message.success("Login successful!");
      navigate(from);
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
          <span>Are you an admin?</span>
          <Link to="/admin/login">
            <Button type="link" size="large">
              Admin Login
            </Button>
          </Link>
        </Space>
      </div>
    </Form>
  );
};

export default LoginForm;
