import MainPageLayout from "../layouts/MainPageLayout";
import { Row, Col, Card, Button, Typography } from "antd";
import {
  RocketOutlined,
  BookOutlined,
  TeamOutlined,
  TrophyOutlined,
} from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const HomePage = () => {
  return (
    <MainPageLayout>
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <Title level={2} style={{ color: "#1890ff", marginBottom: 16 }}>
          Welcome to TestPlatform
        </Title>
        <Paragraph style={{ fontSize: 18, maxWidth: 800, margin: "0 auto" }}>
          Your ultimate destination for online test preparation and skill
          assessment. Join thousands of learners who have improved their skills
          with our platform.
        </Paragraph>
        <Button type="primary" size="large" style={{ marginTop: 24 }}>
          Get Started
        </Button>
      </div>

      <Row gutter={[24, 24]} style={{ marginTop: 48 }}>
        <Col xs={24} sm={12} md={6}>
          <Card hoverable style={{ height: "100%" }}>
            <div style={{ textAlign: "center" }}>
              <RocketOutlined style={{ fontSize: 48, color: "#1890ff" }} />
              <Title level={4} style={{ marginTop: 16 }}>
                Fast Learning
              </Title>
              <Paragraph>
                Accelerate your learning with our optimized courses.
              </Paragraph>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card hoverable style={{ height: "100%" }}>
            <div style={{ textAlign: "center" }}>
              <BookOutlined style={{ fontSize: 48, color: "#1890ff" }} />
              <Title level={4} style={{ marginTop: 16 }}>
                Comprehensive Courses
              </Title>
              <Paragraph>
                Cover all topics with our detailed course materials.
              </Paragraph>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card hoverable style={{ height: "100%" }}>
            <div style={{ textAlign: "center" }}>
              <TeamOutlined style={{ fontSize: 48, color: "#1890ff" }} />
              <Title level={4} style={{ marginTop: 16 }}>
                Expert Instructors
              </Title>
              <Paragraph>
                Learn from industry professionals and subject experts.
              </Paragraph>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card hoverable style={{ height: "100%" }}>
            <div style={{ textAlign: "center" }}>
              <TrophyOutlined style={{ fontSize: 48, color: "#1890ff" }} />
              <Title level={4} style={{ marginTop: 16 }}>
                Proven Results
              </Title>
              <Paragraph>
                Join our successful students who achieved their goals.
              </Paragraph>
            </div>
          </Card>
        </Col>
      </Row>
    </MainPageLayout>
  );
};

export default HomePage;
