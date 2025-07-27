import React from "react";
import { Form, Input, Button, message, Divider, Space } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useAdminLoginMutation } from "../../store/api/adminApi";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../../store/slices/authSlice";
import { setCookie } from "../../utils/cookies";

const AdminLoginForm = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [adminLogin] = useAdminLoginMutation();

  const onFinish = async (values) => {
    try {
      dispatch(loginStart());
      const result = await adminLogin(values).unwrap();

      // Verify the admin role
      if (result.user.role !== "admin") {
        throw new Error("Access denied. Please use the user login page.");
      }

      // Set the token in cookies
      setCookie("token", result.token, 1); // Expires in 1 day

      dispatch(
        loginSuccess({
          user: result.user,
        })
      );

      message.success("Admin login successful!");
      navigate("/admin/dashboard");
    } catch (error) {
      dispatch(loginFailure(error.message || "Login failed"));
      message.error(error.message || "Login failed");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto", padding: "50px 20px" }}>
      <h2 style={{ textAlign: "center", marginBottom: 30 }}>Admin Login</h2>

      <Form
        form={form}
        name="adminLogin"
        onFinish={onFinish}
        layout="vertical"
        requiredMark={false}
        style={{ maxWidth: "100%" }}
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
            placeholder="Enter your admin email"
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
            Admin Login
          </Button>
        </Form.Item>

        {/* <Divider>Or</Divider>

        <div style={{ textAlign: "center" }}>
          <Space direction="vertical">
            <span>Not an admin?</span>
            <Link to="/login">
              <Button type="link" size="large">
                User Login
              </Button>
            </Link>
          </Space>
        </div> */}
      </Form>
    </div>
  );
};

export default AdminLoginForm;
