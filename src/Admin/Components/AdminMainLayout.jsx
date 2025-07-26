import React, { useState } from "react";
import { Layout } from "antd";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import "./AdminMainLayout.css";

const { Content } = Layout;

const AdminMainLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <Layout
        className={`admin-content-layout ${collapsed ? "collapsed" : ""}`}
      >
        <AdminHeader collapsed={collapsed} setCollapsed={setCollapsed} />

        <Content className="admin-content">{children}</Content>
      </Layout>
    </Layout>
  );
};

export default AdminMainLayout;
