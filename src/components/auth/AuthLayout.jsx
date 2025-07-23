import React from "react";
import { Layout, Card, Row, Col } from "antd";
import { Link } from "react-router-dom";

const { Content } = Layout;

const AuthLayout = ({ children, title }) => {
  return (
    <Layout style={{ minHeight: "100vh", background: "#f0f2f5" }}>
      <Content
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "50px 0",
        }}
      >
        <Row justify="center" style={{ width: "100%" }}>
          <Col xs={22} sm={16} md={12} lg={8} xl={6}>
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <Link
                to="/"
                style={{
                  fontSize: "28px",
                  fontWeight: "bold",
                  color: "#1890ff",
                  textDecoration: "none",
                }}
              >
                TestPlatform
              </Link>
            </div>

            <Card
              title={title}
              style={{
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                borderRadius: "8px",
              }}
              headStyle={{
                textAlign: "center",
                fontSize: "20px",
                fontWeight: "600",
              }}
            >
              {children}
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default AuthLayout;
