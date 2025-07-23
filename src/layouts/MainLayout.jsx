import React from "react";
import { Layout } from "antd";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";

const { Content } = Layout;

const MainLayout = ({ children }) => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header />
      <Content
        style={{
          padding: "24px",
          background: "#f5f5f5",
          flex: 1,
        }}
      >
        {children}
      </Content>
      <Footer />
    </Layout>
  );
};

export default MainLayout;
