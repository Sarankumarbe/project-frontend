import React from "react";
import { Layout, Row, Col, Space } from "antd";
import {
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  FacebookOutlined,
  TwitterOutlined,
  LinkedinOutlined,
} from "@ant-design/icons";

const { Footer: AntFooter } = Layout;

const Footer = () => {
  return (
    <AntFooter
      style={{
        background: "#001529",
        color: "#fff",
        marginTop: "auto",
      }}
    >
      <Row gutter={[32, 16]}>
        <Col xs={24} sm={12} md={8}>
          <h3 style={{ color: "#fff", marginBottom: "16px" }}>TestPlatform</h3>
          <p style={{ color: "#ccc" }}>
            Your ultimate destination for online test preparation and skill
            assessment.
          </p>
          <Space size="large">
            <FacebookOutlined style={{ fontSize: "20px", color: "#1890ff" }} />
            <TwitterOutlined style={{ fontSize: "20px", color: "#1890ff" }} />
            <LinkedinOutlined style={{ fontSize: "20px", color: "#1890ff" }} />
          </Space>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <h4 style={{ color: "#fff", marginBottom: "16px" }}>Quick Links</h4>
          <div style={{ color: "#ccc" }}>
            <p>
              <a href="/courses" style={{ color: "#ccc" }}>
                Courses
              </a>
            </p>
            <p>
              <a href="/about" style={{ color: "#ccc" }}>
                About Us
              </a>
            </p>
            <p>
              <a href="/contact" style={{ color: "#ccc" }}>
                Contact
              </a>
            </p>
            <p>
              <a href="/services" style={{ color: "#ccc" }}>
                Services
              </a>
            </p>
          </div>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <h4 style={{ color: "#fff", marginBottom: "16px" }}>Contact Info</h4>
          <div style={{ color: "#ccc" }}>
            <p>
              <EnvironmentOutlined /> 123 Education Street, Learning City
            </p>
            <p>
              <PhoneOutlined /> +1 234 567 8900
            </p>
            <p>
              <MailOutlined /> info@testplatform.com
            </p>
          </div>
        </Col>
      </Row>

      <div
        style={{
          textAlign: "center",
          marginTop: "32px",
          paddingTop: "16px",
          borderTop: "1px solid #333",
          color: "#ccc",
        }}
      >
        © 2024 TestPlatform. All rights reserved.
      </div>
    </AntFooter>
  );
};

export default Footer;
