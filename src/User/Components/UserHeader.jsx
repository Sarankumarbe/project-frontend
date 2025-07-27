import React from "react";
import {
  Layout,
  Input,
  Dropdown,
  Menu,
  Avatar,
  Badge,
  Space,
  Button,
} from "antd";
import {
  SearchOutlined,
  BellOutlined,
  LogoutOutlined,
  UserOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import "./UserHeader.css";
import { useNavigate } from "react-router-dom";

const { Header } = Layout;

const UserHeader = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};

  const menu = (
    <Menu>
      <Menu.Item
        key="user-info"
        disabled
        style={{ cursor: "default", opacity: 1 }}
      >
        <div style={{ padding: "8px 12px" }}>
          <div style={{ fontWeight: "bold" }}>
            {userInfo.firstName} {userInfo.lastName}
          </div>
          <div style={{ color: "#888", fontSize: "12px" }}>
            {userInfo.email}
          </div>
          <div
            style={{
              color: "#888",
              fontSize: "12px",
              textTransform: "capitalize",
            }}
          >
            {userInfo.role}
          </div>
        </div>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="profile">
        <Space>
          <UserOutlined />
          Profile
        </Space>
      </Menu.Item>
      <Menu.Item
        key="logout"
        onClick={() => {
          localStorage.removeItem("userInfo");
          navigate("/login");
        }}
      >
        <Space>
          <LogoutOutlined />
          Logout
        </Space>
      </Menu.Item>
    </Menu>
  );

  return (
    <Header className="admin-header">
      <div className="header-left">
        <Button
          className="desktop-collapse-button"
          type="text"
          icon={<MenuOutlined />}
          onClick={() => setCollapsed(!collapsed)}
        />
        <div className="search-container">
          <Input
            placeholder="Search..."
            prefix={<SearchOutlined />}
            className="search-input"
          />
        </div>
      </div>

      <Space className="header-actions">
        <Badge count={5} size="small">
          <BellOutlined className="notification-icon" />
        </Badge>

        <Dropdown overlay={menu} placement="bottomRight">
          <Space className="user-dropdown">
            <Avatar icon={<UserOutlined />} className="user-avatar" />
          </Space>
        </Dropdown>
      </Space>
    </Header>
  );
};

export default UserHeader;
