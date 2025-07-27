import React, { useState } from "react";
import { Layout } from "antd";
import UserHeader from "./UserHeader";
import UserSidebar from "./UserSidebar";
import "./UserMainLayout.css";

const { Content } = Layout;

const UserMainLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <UserSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <Layout
        className={`admin-content-layout ${collapsed ? "collapsed" : ""}`}
      >
        <UserHeader collapsed={collapsed} setCollapsed={setCollapsed} />

        <Content className="admin-content">{children}</Content>
      </Layout>
    </Layout>
  );
};

export default UserMainLayout;
