import React from "react";
import { Form, Input, Button, message, Divider, Space } from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useUserRegisterMutation } from "../../store/api/userApi";

const RegisterForm = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [register, { isLoading }] = useUserRegisterMutation();

  const onFinish = async (values) => {
    try {
      const { confirmPassword, ...registerData } = values;
      registerData.role = "user";

      await register(registerData).unwrap();
      message.success("Registration successful! Please login to continue.");
      navigate("/login");
    } catch (error) {
      message.error(error.data?.message || "Registration failed");
    }
  };

  return (
    <Form
      form={form}
      name="register"
      onFinish={onFinish}
      layout="vertical"
      requiredMark={false}
    >
      <Form.Item
        name="firstName"
        label="First Name"
        rules={[
          { required: true, message: "Please input your first name!" },
          { min: 2, message: "First name must be at least 2 characters!" },
        ]}
      >
        <Input
          prefix={<UserOutlined />}
          placeholder="Enter your first name"
          size="large"
        />
      </Form.Item>

      <Form.Item
        name="lastName"
        label="Last Name"
        rules={[
          { required: true, message: "Please input your last name!" },
          { min: 2, message: "Last name must be at least 2 characters!" },
        ]}
      >
        <Input
          prefix={<UserOutlined />}
          placeholder="Enter your last name"
          size="large"
        />
      </Form.Item>

      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: "Please input your email!" },
          { type: "email", message: "Please enter a valid email!" },
        ]}
      >
        <Input
          prefix={<MailOutlined />}
          placeholder="Enter your email"
          size="large"
        />
      </Form.Item>

      <Form.Item
        name="phone"
        label="Phone Number"
        rules={[
          { required: true, message: "Please input your phone number!" },
          {
            pattern: /^[0-9]{10}$/,
            message: "Please enter a valid 10-digit phone number!",
          },
        ]}
      >
        <Input
          prefix={<PhoneOutlined />}
          placeholder="Enter your phone number"
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

      <Form.Item
        name="confirmPassword"
        label="Confirm Password"
        dependencies={["password"]}
        rules={[
          { required: true, message: "Please confirm your password!" },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error("Passwords do not match!"));
            },
          }),
        ]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="Confirm your password"
          size="large"
        />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          loading={isLoading}
          style={{ width: "100%" }}
        >
          Register
        </Button>
      </Form.Item>

      <Divider>Or</Divider>

      <div style={{ textAlign: "center" }}>
        <Space direction="vertical">
          <span>Already have an account?</span>
          <Link to="/login">
            <Button type="link" size="large">
              Login Now
            </Button>
          </Link>
        </Space>
      </div>
    </Form>
  );
};

export default RegisterForm;
