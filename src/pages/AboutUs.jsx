import MainPageLayout from "../layouts/MainPageLayout";
import { Typography, Row, Col, Image } from "antd";

const { Title, Paragraph } = Typography;

const AboutUs = () => {
  return (
    <MainPageLayout>
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <Title level={2} style={{ color: "#1890ff" }}>
          About TestPlatform
        </Title>
        <Paragraph style={{ fontSize: 18, maxWidth: 800, margin: "0 auto" }}>
          We are dedicated to providing high-quality test preparation resources
          to help you succeed.
        </Paragraph>
      </div>

      <Row gutter={[48, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} md={12}>
          <Title level={3}>Our Mission</Title>
          <Paragraph style={{ fontSize: 16 }}>
            To empower learners worldwide by providing accessible, affordable,
            and high-quality test preparation resources. We believe that
            everyone deserves the opportunity to demonstrate their true
            potential.
          </Paragraph>
          <Title level={3} style={{ marginTop: 24 }}>
            Our Vision
          </Title>
          <Paragraph style={{ fontSize: 16 }}>
            To become the most trusted and comprehensive online learning
            platform, helping millions of learners achieve their academic and
            professional goals.
          </Paragraph>
        </Col>
        <Col xs={24} md={12}>
          <div
            style={{
              borderRadius: 8,
              overflow: "hidden",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              alt="Team working"
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        </Col>
      </Row>
    </MainPageLayout>
  );
};

export default AboutUs;
