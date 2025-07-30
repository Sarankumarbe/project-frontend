import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  Row,
  Col,
  Divider,
  message,
  Modal,
  Descriptions,
  Switch,
  Space,
} from "antd";
import {
  EditOutlined,
  LockOutlined,
  SaveOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import AdminMainLayout from "../Components/AdminMainLayout";

const AdminProfile = () => {
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [adminData, setAdminData] = useState({
    firstName: "Admin",
    lastName: "User",
    email: "admin@example.com",
    role: "admin",
    status: "active",
  });

  // This would be replaced with an API call in a real implementation
  useEffect(() => {
    // Simulate fetching admin data
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        // Replace with actual API call
        // const response = await getAdminProfile();
        // setAdminData(response.data);
        setLoading(false);
      } catch (error) {
        message.error("Failed to fetch admin data");
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const handleEdit = () => {
    form.setFieldsValue(adminData);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = async (values) => {
    try {
      setLoading(true);
      // Replace with actual API call
      // await updateAdminProfile(values);
      setAdminData(values);
      setIsEditing(false);
      message.success("Profile updated successfully");
      setLoading(false);
    } catch (error) {
      message.error("Failed to update profile");
      setLoading(false);
    }
  };

  const handlePasswordChange = async (values) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      // Replace with actual API call
      // await changeAdminPassword({
      //   currentPassword: values.currentPassword,
      //   newPassword: values.newPassword
      // });
      message.success("Password changed successfully");
      setShowPasswordModal(false);
      passwordForm.resetFields();
      setLoading(false);
    } catch (error) {
      message.error(
        error.response?.data?.message || "Failed to change password"
      );
      setLoading(false);
    }
  };

  return (
    <AdminMainLayout>
      <Card
        title="Admin Profile"
        loading={loading}
        extra={
          !isEditing ? (
            <Button type="primary" icon={<EditOutlined />} onClick={handleEdit}>
              Edit Profile
            </Button>
          ) : null
        }
      >
        {!isEditing ? (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="First Name">
              {adminData.firstName}
            </Descriptions.Item>
            <Descriptions.Item label="Last Name">
              {adminData.lastName}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {adminData.email}
            </Descriptions.Item>
            <Descriptions.Item label="Role">{adminData.role}</Descriptions.Item>
            <Descriptions.Item label="Status">
              <Space>
                {adminData.status === "active" ? "Active" : "Inactive"}
                <Switch
                  checked={adminData.status === "active"}
                  checkedChildren="Active"
                  unCheckedChildren="Inactive"
                  disabled
                />
              </Space>
            </Descriptions.Item>
          </Descriptions>
        ) : (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSave}
            initialValues={adminData}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="firstName"
                  label="First Name"
                  rules={[
                    { required: true, message: "Please enter your first name" },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="lastName"
                  label="Last Name"
                  rules={[
                    { required: true, message: "Please enter your last name" },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input disabled />
            </Form.Item>
            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  loading={loading}
                >
                  Save Changes
                </Button>
                <Button onClick={handleCancel} icon={<CloseOutlined />}>
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          </Form>
        )}

        <Divider />

        <Button
          type="primary"
          danger
          icon={<LockOutlined />}
          onClick={() => setShowPasswordModal(true)}
        >
          Change Password
        </Button>
      </Card>

      {/* Password Change Modal */}
      <Modal
        title="Change Password"
        visible={showPasswordModal}
        onCancel={() => {
          setShowPasswordModal(false);
          passwordForm.resetFields();
        }}
        footer={null}
        destroyOnClose
      >
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handlePasswordChange}
        >
          <Form.Item
            name="currentPassword"
            label="Current Password"
            rules={[
              { required: true, message: "Please enter your current password" },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label="New Password"
            rules={[
              { required: true, message: "Please enter a new password" },
              { min: 8, message: "Password must be at least 8 characters" },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="Confirm New Password"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Please confirm your new password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The two passwords do not match")
                  );
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Change Password
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </AdminMainLayout>
  );
};

export default AdminProfile;
