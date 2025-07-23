import React from "react";
import { Layout, Menu, Button, Avatar, Dropdown, Space } from "antd";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  HomeOutlined,
  BookOutlined,
  InfoCircleOutlined,
  ContactsOutlined,
  UserOutlined,
  LogoutOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import { logout } from "../../store/slices/authSlice";

const { Header: AntHeader } = Layout;

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { isAuthenticated, user, role } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const userMenuItems = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
      onClick: () =>
        navigate(role === "admin" ? "/admin/dashboard" : "/user/dashboard"),
    },
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Profile",
      onClick: () => navigate("/user/profile"),
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      onClick: handleLogout,
    },
  ];

  const publicMenuItems = [
    {
      key: "/",
      icon: <HomeOutlined />,
      label: <Link to="/">Home</Link>,
    },
    {
      key: "/courses",
      icon: <BookOutlined />,
      label: <Link to="/courses">Courses</Link>,
    },
    {
      key: "/about",
      icon: <InfoCircleOutlined />,
      label: <Link to="/about">About</Link>,
    },
    {
      key: "/contact",
      icon: <ContactsOutlined />,
      label: <Link to="/contact">Contact</Link>,
    },
  ];

  return (
    <AntHeader
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        background: "#fff",
        borderBottom: "1px solid #f0f0f0",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <div
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            color: "#1890ff",
            marginRight: "32px",
          }}
        >
          TestPlatform
        </div>

        <Menu
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={publicMenuItems}
          style={{ border: "none", flex: 1 }}
        />
      </div>

      <div>
        {isAuthenticated ? (
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Space style={{ cursor: "pointer" }}>
              <Avatar icon={<UserOutlined />} />
              <span>{user?.name || user?.email}</span>
            </Space>
          </Dropdown>
        ) : (
          <Space>
            <Button type="text" onClick={() => navigate("/login")}>
              Login
            </Button>
            <Button type="primary" onClick={() => navigate("/register")}>
              Register
            </Button>
          </Space>
        )}
      </div>
    </AntHeader>
  );
};

export default Header;
