import React, { useState, useEffect } from "react";
import { Layout, Menu, Button, Space, Drawer } from "antd";
import {
  HomeOutlined,
  InfoCircleOutlined,
  BookOutlined,
  ContactsOutlined,
  LoginOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";

const { Header: AntHeader } = Layout;

const Header = () => {
  const [current, setCurrent] = useState("home");
  const [drawerVisible, setDrawerVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    if (path === "/") setCurrent("home");
    else if (path === "/about") setCurrent("about");
    else if (path === "/home-courses") setCurrent("courses");
    else if (path === "/contact") setCurrent("contact");
    else if (path === "/login") setCurrent("");
    else if (path === "/register") setCurrent("");
  }, [location]);

  const menuItems = [
    {
      key: "home",
      icon: <HomeOutlined />,
      label: "Home",
      path: "/",
    },
    {
      key: "about",
      icon: <InfoCircleOutlined />,
      label: "About",
      path: "/about",
    },
    {
      key: "courses",
      icon: <BookOutlined />,
      label: "Courses",
      path: "/home-courses",
    },
    {
      key: "contact",
      icon: <ContactsOutlined />,
      label: "Contact",
      path: "/contact",
    },
  ];

  const handleMenuClick = (e) => {
    setCurrent(e.key);
    const selectedItem = menuItems.find((item) => item.key === e.key);
    if (selectedItem) {
      navigate(selectedItem.path);
    }
    setDrawerVisible(false);
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <AntHeader
      style={{
        position: "fixed",
        zIndex: 1,
        width: "100%",
        backgroundColor: "#fff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        padding: "0 20px",
        height: "80px",
        lineHeight: "80px",
        borderBottom: "1px solid #f0f0f0",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: "1200px",
          margin: "0 auto",
          height: "100%",
        }}
      >
        {/* Logo */}
        <div
          style={{
            color: "#1890ff",
            fontSize: "24px",
            fontWeight: "bold",
            cursor: "pointer",
            letterSpacing: "1px",
          }}
          onClick={() => navigate("/")}
        >
          TestPlatform
        </div>

        {/* Desktop Navigation */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <Menu
            theme="light"
            mode="horizontal"
            selectedKeys={[current]}
            onClick={handleMenuClick}
            style={{
              borderBottom: "none",
              lineHeight: "78px",
              display: "none",
              background: "transparent",
            }}
            className="desktop-menu"
            items={menuItems}
          />

          <Button
            type="primary"
            onClick={handleLoginClick}
            style={{
              background: "#1890ff",
              border: "none",
              borderRadius: "4px",
              fontWeight: "500",
              height: "40px",
              display: "none",
            }}
            className="desktop-login-btn"
          >
            Sign In
          </Button>

          {/* Mobile Menu Button */}
          <Button
            type="text"
            icon={<MenuOutlined style={{ fontSize: "20px" }} />}
            onClick={() => setDrawerVisible(true)}
            style={{
              color: "#1890ff",
              display: "none",
            }}
            className="mobile-menu-btn"
          />
        </div>
      </div>

      {/* Mobile Drawer */}
      <Drawer
        title="Menu"
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={280}
        bodyStyle={{ padding: 0 }}
        headerStyle={{ borderBottom: "1px solid #f0f0f0" }}
      >
        <Menu
          mode="vertical"
          selectedKeys={[current]}
          onClick={handleMenuClick}
          style={{ border: "none", padding: "16px 0" }}
          items={menuItems.map((item) => ({
            ...item,
            style: {
              margin: "4px 0",
              borderRadius: 4,
            },
          }))}
        />
        <div style={{ padding: "16px" }}>
          <Button
            type="primary"
            onClick={handleLoginClick}
            block
            style={{
              background: "#1890ff",
              border: "none",
              borderRadius: "4px",
              fontWeight: "500",
              height: "40px",
            }}
          >
            Sign In
          </Button>
        </div>
      </Drawer>

      <style jsx>{`
        @media (min-width: 768px) {
          .desktop-menu {
            display: flex !important;
          }
          .desktop-login-btn {
            display: inline-flex !important;
          }
        }

        @media (max-width: 767px) {
          .mobile-menu-btn {
            display: inline-flex !important;
          }
        }

        .ant-menu-item {
          font-weight: 500;
          color: #555 !important;
          border-bottom: 3px solid transparent !important;
          transition: all 0.3s ease;
          margin: 0 8px !important;
          padding: 0 12px !important;
          height: 78px !important;
          display: flex !important;
          align-items: center !important;
        }

        .ant-menu-item:hover {
          color: #1890ff !important;
          background: rgba(24, 144, 255, 0.05) !important;
        }

        .ant-menu-item-selected {
          color: #1890ff !important;
          border-bottom-color: #1890ff !important;
          background: transparent !important;
          font-weight: 600 !important;
        }

        .ant-menu-item-selected .anticon {
          color: #1890ff !important;
        }

        /* Mobile menu items */
        .ant-menu-vertical .ant-menu-item {
          height: 48px !important;
          line-height: 48px !important;
          margin: 4px 8px !important;
        }

        .ant-menu-vertical .ant-menu-item-selected {
          background: rgba(24, 144, 255, 0.1) !important;
          border-left: 3px solid #1890ff !important;
          border-bottom: none !important;
        }

        .ant-menu-vertical .ant-menu-item:hover {
          background: rgba(24, 144, 255, 0.05) !important;
        }
      `}</style>
    </AntHeader>
  );
};

export default Header;
