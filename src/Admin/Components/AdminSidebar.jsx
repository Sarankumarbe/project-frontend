import React, { useState } from "react";
import { Layout, Menu, Drawer, Button } from "antd";
import {
  DashboardOutlined,
  BookOutlined,
  CreditCardOutlined,
  UserOutlined,
  MenuOutlined,
  LeftOutlined,
  RightOutlined,
  QuestionCircleOutlined,
  UsergroupAddOutlined,
  GiftOutlined,
  TagOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import "./AdminSidebar.css";

const { Sider } = Layout;

const AdminSidebar = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerVisible, setDrawerVisible] = useState(false);

  const menuItems = [
    {
      key: "/admin/dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
    },
    { key: "/admin/users", icon: <UsergroupAddOutlined />, label: "Users" },
    { key: "/admin/courses", icon: <BookOutlined />, label: "Courses" },
    {
      key: "/admin/question-paper",
      icon: <QuestionCircleOutlined />,
      label: "Questions Upload",
    },
    { key: "/admin/payments", icon: <CreditCardOutlined />, label: "Payments" },
    { key: "/admin/coupons", icon: <TagOutlined />, label: "Coupons" },
    { key: "/admin/profile", icon: <UserOutlined />, label: "Profile" },
  ];

  const toggleDrawer = () => setDrawerVisible(!drawerVisible);
  const toggleCollapse = () => setCollapsed(!collapsed);

  const menu = (
    <Menu
      theme="light"
      mode="inline"
      selectedKeys={[location.pathname]}
      items={menuItems}
      onSelect={({ key }) => {
        navigate(key);
        setDrawerVisible(false);
      }}
      style={{ borderRight: 0 }}
    />
  );

  return (
    <>
      <Button
        className="mobile-menu-button"
        type="text"
        icon={<MenuOutlined />}
        onClick={toggleDrawer}
      />

      <Sider
        className="desktop-sidebar"
        width={250}
        collapsedWidth={80}
        collapsible
        collapsed={collapsed}
        onCollapse={toggleCollapse}
        trigger={null}
      >
        <div className="sidebar-header">
          {!collapsed ? (
            <h2>Admin Panel</h2>
          ) : (
            <div className="collapsed-title">AP</div>
          )}
        </div>
        {menu}
        <div className="collapse-trigger" onClick={toggleCollapse}>
          {collapsed ? <RightOutlined /> : <LeftOutlined />}
        </div>
      </Sider>

      <Drawer
        className="mobile-drawer"
        title="Admin Panel"
        placement="left"
        closable={true}
        onClose={toggleDrawer}
        open={drawerVisible}
        width={250}
        bodyStyle={{ padding: 0 }}
        headerStyle={{ padding: "16px 24px" }}
      >
        {menu}
      </Drawer>
    </>
  );
};

export default AdminSidebar;
