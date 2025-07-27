import React from "react";
import { Layout } from "antd";
import Header from "../components/common/Header";
import HomeFooter from "../components/common/Footer";

const { Content } = Layout;

const MainPageLayout = ({ children, isAuthPage = false }) => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header />
      <Content
        style={{
          padding: isAuthPage ? "20px 24px" : "80px 24px 24px",
          background: "#fff",
          flex: 1,
          marginTop: 80, // Matches header height
          minHeight: "calc(100vh - 160px)", // Adjust based on header/footer height
          display: isAuthPage ? "flex" : "block",
          alignItems: isAuthPage ? "center" : "flex-start",
          justifyContent: isAuthPage ? "center" : "flex-start",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            width: "100%",
            ...(isAuthPage && {
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "100%",
            }),
          }}
        >
          {children}
        </div>
      </Content>
      <HomeFooter />
    </Layout>
  );
};

export default MainPageLayout;
