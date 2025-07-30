import React, { useEffect } from "react";
import { Modal, Form, Input, Button, message } from "antd";
import { UserOutlined, MailOutlined, LockOutlined } from "@ant-design/icons";

const AddEditUserModal = ({ visible, mode, user, onCancel, onSuccess }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      if (mode === "edit" && user) {
        form.setFieldsValue({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        });
      } else {
        form.resetFields();
      }
    }
  }, [visible, mode, user, form]);

  const handleSubmit = async (values) => {
    try {
      const payload = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        role: "user",
        status: "inactive",
      };

      if (mode === "add") {
        payload.password = values.password;
      }

      // TODO: Replace with actual API calls
      if (mode === "add") {
        // await userAPI.createUser(payload);
        console.log("Creating user:", payload);
        message.success("User created successfully");
      } else {
        // await userAPI.updateUser(user.id, payload);
        console.log("Updating user:", user.id, payload);
        message.success("User updated successfully");
      }

      form.resetFields();
      onSuccess();
    } catch (error) {
      console.error(
        `Error ${mode === "add" ? "creating" : "updating"} user:`,
        error
      );
      message.error(`Failed to ${mode === "add" ? "create" : "update"} user`);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const validatePassword = (_, value) => {
    if (!value) {
      return Promise.reject(new Error("Please input your password!"));
    }
    if (value.length < 6) {
      return Promise.reject(
        new Error("Password must be at least 6 characters!")
      );
    }
    return Promise.resolve();
  };

  const validateConfirmPassword = (_, value) => {
    if (!value) {
      return Promise.reject(new Error("Please confirm your password!"));
    }
    if (value !== form.getFieldValue("password")) {
      return Promise.reject(new Error("Passwords do not match!"));
    }
    return Promise.resolve();
  };

  return (
    <Modal
      title={mode === "add" ? "Add New User" : "Edit User"}
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={500}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
      >
        <Form.Item
          name="firstName"
          label="First Name"
          rules={[
            { required: true, message: "Please input the first name!" },
            { min: 2, message: "First name must be at least 2 characters!" },
          ]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="Enter first name"
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="lastName"
          label="Last Name"
          rules={[
            { required: true, message: "Please input the last name!" },
            { min: 2, message: "Last name must be at least 2 characters!" },
          ]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="Enter last name"
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Please input the email!" },
            { type: "email", message: "Please enter a valid email!" },
          ]}
        >
          <Input
            prefix={<MailOutlined />}
            placeholder="Enter email address"
            size="large"
          />
        </Form.Item>

        {mode === "add" && (
          <>
            <Form.Item
              name="password"
              label="Password"
              rules={[{ validator: validatePassword }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Enter password"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Confirm Password"
              dependencies={["password"]}
              rules={[{ validator: validateConfirmPassword }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Confirm password"
                size="large"
              />
            </Form.Item>
          </>
        )}

        <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              {mode === "add" ? "Create User" : "Update User"}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddEditUserModal;
