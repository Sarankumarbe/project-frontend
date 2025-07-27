import React from "react";
import { Layout, Row, Col, Space, Divider } from "antd";
import {
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  FacebookOutlined,
  TwitterOutlined,
  LinkedinOutlined,
  HomeOutlined,
  InfoCircleOutlined,
  BookOutlined,
  ContactsOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";

const { Footer: AntFooter } = Layout;

const HomeFooter = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationLinks = [
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

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <AntFooter
      style={{
        background: "#f9f9f9",
        color: "#333",
        padding: "60px 20px 30px",
        borderTop: "1px solid #f0f0f0",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <Row gutter={[32, 32]}>
          {/* Brand Section */}
          <Col xs={24} sm={12} lg={6}>
            <div
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                marginBottom: "16px",
                color: "#1890ff",
              }}
            >
              TestPlatform
            </div>
            <p
              style={{
                color: "#666",
                lineHeight: "1.6",
                marginBottom: "20px",
              }}
            >
              Your ultimate destination for online test preparation and skill
              assessment.
            </p>
            <Space size="large">
              <FacebookOutlined
                style={{
                  fontSize: "20px",
                  color: "#4267B2",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                className="social-icon"
              />
              <TwitterOutlined
                style={{
                  fontSize: "20px",
                  color: "#1DA1F2",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                className="social-icon"
              />
              <LinkedinOutlined
                style={{
                  fontSize: "20px",
                  color: "#0077b5",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                className="social-icon"
              />
            </Space>
          </Col>

          {/* Quick Links */}
          <Col xs={24} sm={12} lg={6}>
            <h4
              style={{
                color: "#333",
                marginBottom: "20px",
                fontSize: "16px",
                fontWeight: "600",
              }}
            >
              Quick Links
            </h4>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              {navigationLinks.map((link) => (
                <div
                  key={link.key}
                  onClick={() => handleNavigate(link.path)}
                  style={{
                    color: isActive(link.path) ? "#1890ff" : "#666",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "4px 0",
                    transition: "all 0.3s ease",
                    fontWeight: isActive(link.path) ? "500" : "400",
                  }}
                  className="nav-link"
                >
                  {link.icon}
                  {link.label}
                </div>
              ))}
            </div>
          </Col>

          {/* Services */}
          <Col xs={24} sm={12} lg={6}>
            <h4
              style={{
                color: "#333",
                marginBottom: "20px",
                fontSize: "16px",
                fontWeight: "600",
              }}
            >
              Our Services
            </h4>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              <div
                style={{
                  color: "#666",
                  cursor: "pointer",
                  transition: "color 0.3s ease",
                }}
                className="service-link"
              >
                Online Test Preparation
              </div>
              <div
                style={{
                  color: "#666",
                  cursor: "pointer",
                  transition: "color 0.3s ease",
                }}
                className="service-link"
              >
                Skill Assessment
              </div>
              <div
                style={{
                  color: "#666",
                  cursor: "pointer",
                  transition: "color 0.3s ease",
                }}
                className="service-link"
              >
                Personalized Learning
              </div>
              <div
                style={{
                  color: "#666",
                  cursor: "pointer",
                  transition: "color 0.3s ease",
                }}
                className="service-link"
              >
                Progress Tracking
              </div>
            </div>
          </Col>

          {/* Contact Info */}
          <Col xs={24} sm={12} lg={6}>
            <h4
              style={{
                color: "#333",
                marginBottom: "20px",
                fontSize: "16px",
                fontWeight: "600",
              }}
            >
              Contact Us
            </h4>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              <div
                style={{
                  color: "#666",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  lineHeight: "1.5",
                }}
              >
                <EnvironmentOutlined style={{ color: "#1890ff" }} />
                123 Education Street, Learning City
              </div>
              <div
                style={{
                  color: "#666",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <PhoneOutlined style={{ color: "#1890ff" }} />
                +1 234 567 8900
              </div>
              <div
                style={{
                  color: "#666",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <MailOutlined style={{ color: "#1890ff" }} />
                info@testplatform.com
              </div>
            </div>
          </Col>
        </Row>

        <Divider style={{ borderColor: "#e8e8e8", margin: "40px 0 20px" }} />

        <div
          style={{
            textAlign: "center",
            color: "#999",
            fontSize: "14px",
          }}
        >
          <Row gutter={[16, 8]} justify="center" align="middle">
            <Col xs={24} sm={12}>
              © {new Date().getFullYear()} TestPlatform. All rights reserved.
            </Col>
            <Col xs={24} sm={12}>
              <Space split={<span style={{ color: "#ddd" }}>|</span>}>
                <span
                  style={{ cursor: "pointer", transition: "color 0.3s ease" }}
                  className="footer-link"
                >
                  Privacy Policy
                </span>
                <span
                  style={{ cursor: "pointer", transition: "color 0.3s ease" }}
                  className="footer-link"
                >
                  Terms of Service
                </span>
                <span
                  style={{ cursor: "pointer", transition: "color 0.3s ease" }}
                  className="footer-link"
                >
                  Support
                </span>
              </Space>
            </Col>
          </Row>
        </div>
      </div>

      <style jsx>{`
        .social-icon:hover {
          transform: translateY(-2px);
        }

        .nav-link:hover {
          color: #1890ff !important;
        }

        .service-link:hover {
          color: #1890ff !important;
        }

        .footer-link:hover {
          color: #1890ff !important;
        }
      `}</style>
    </AntFooter>
  );
};

export default HomeFooter;
