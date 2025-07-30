import React from "react";
import { Modal, Descriptions, Tag, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";

const ViewUserModal = ({ visible, user, onCancel }) => {
  if (!user) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "green";
      case "inactive":
        return "red";
      default:
        return "default";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Modal
      title="User Details"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
    >
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <Avatar
          size={80}
          icon={<UserOutlined />}
          style={{ backgroundColor: "#1890ff", marginBottom: 16 }}
        />
        <h2 style={{ margin: 0 }}>
          {user.firstName} {user.lastName}
        </h2>
        <p style={{ color: "#666", margin: 0 }}>{user.email}</p>
      </div>

      <Descriptions
        bordered
        column={1}
        size="middle"
        labelStyle={{ fontWeight: "bold", width: "30%" }}
      >
        <Descriptions.Item label="User ID">{user.id}</Descriptions.Item>

        <Descriptions.Item label="First Name">
          {user.firstName}
        </Descriptions.Item>

        <Descriptions.Item label="Last Name">{user.lastName}</Descriptions.Item>

        <Descriptions.Item label="Email Address">
          {user.email}
        </Descriptions.Item>

        <Descriptions.Item label="Role">
          <Tag color="blue">{user.role.toUpperCase()}</Tag>
        </Descriptions.Item>

        <Descriptions.Item label="Status">
          <Tag color={getStatusColor(user.status)}>
            {user.status.toUpperCase()}
          </Tag>
        </Descriptions.Item>

        <Descriptions.Item label="Created Date">
          {formatDate(user.createdAt)}
        </Descriptions.Item>

        <Descriptions.Item label="Last Login">
          {user.lastLogin ? formatDate(user.lastLogin) : "Never"}
        </Descriptions.Item>

        <Descriptions.Item label="Profile Status">
          {user.profileCompleted ? (
            <Tag color="green">Complete</Tag>
          ) : (
            <Tag color="orange">Incomplete</Tag>
          )}
        </Descriptions.Item>
      </Descriptions>

      <div style={{ marginTop: 24, textAlign: "center" }}>
        <span style={{ color: "#666", fontSize: "12px" }}>
          * This is a read-only view of the user profile
        </span>
      </div>
    </Modal>
  );
};

export default ViewUserModal;
