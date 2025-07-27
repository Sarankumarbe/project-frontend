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
  ShopOutlined,
  CarryOutOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import "./UserSidebar.css";

const { Sider } = Layout;

const UserSidebar = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerVisible, setDrawerVisible] = useState(false);

  const menuItems = [
    {
      key: "/dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
    },
    { key: "/user-course", icon: <BookOutlined />, label: "Courses" },
    { key: "/cart", icon: <ShoppingCartOutlined />, label: "Cart" },
    { key: "/profile", icon: <UserOutlined />, label: "Profile" },
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
            <h2>User Panel</h2>
          ) : (
            <div className="collapsed-title">UP</div>
          )}
        </div>
        {menu}
        <div className="collapse-trigger" onClick={toggleCollapse}>
          {collapsed ? <RightOutlined /> : <LeftOutlined />}
        </div>
      </Sider>

      <Drawer
        className="mobile-drawer"
        title="User Panel"
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

export default UserSidebar;
