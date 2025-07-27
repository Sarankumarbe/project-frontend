import React from "react";
import { Layout, Card, Row, Col } from "antd";
import { Link } from "react-router-dom";

const { Content } = Layout;

const AuthLayout = ({ children, title }) => {
  return (
    <div style={{ width: "100%", padding: "20px 0" }}>
      <Row justify="center" style={{ width: "100%" }}>
        <Col xs={24} sm={20} md={16} lg={12} xl={10}>
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <Link
              to="/"
              style={{
                fontSize: "28px",
                fontWeight: "bold",
                color: "#1890ff",
                textDecoration: "none",
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
              }}
            >
              TestPlatform
            </Link>
            <p style={{ marginTop: "8px", color: "#666", fontSize: "14px" }}>
              {title === "Welcome Back"
                ? "Login to your account"
                : "Get started with your account"}
            </p>
          </div>

          <Card
            title={title}
            style={{
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              borderRadius: "8px",
              border: "none",
            }}
            headStyle={{
              textAlign: "center",
              fontSize: "18px",
              fontWeight: "600",
              borderBottom: "1px solid #f0f0f0",
              padding: "12px 20px",
            }}
            bodyStyle={{
              padding: "20px",
            }}
          >
            {children}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AuthLayout;
