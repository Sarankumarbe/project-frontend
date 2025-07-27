import MainPageLayout from "../layouts/MainPageLayout";
import { Typography, Row, Col, Card, Button, Tag } from "antd";
import {
  StarFilled,
  UserOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const courses = [
  {
    id: 1,
    title: "Advanced Mathematics",
    description: "Master advanced mathematical concepts for competitive exams.",
    level: "Advanced",
    duration: "8 weeks",
    students: 1250,
    rating: 4.8,
  },
  {
    id: 2,
    title: "English Proficiency",
    description:
      "Improve your English language skills for academic and professional success.",
    level: "Intermediate",
    duration: "6 weeks",
    students: 980,
    rating: 4.6,
  },
  {
    id: 3,
    title: "Coding Fundamentals",
    description: "Learn the basics of programming with hands-on exercises.",
    level: "Beginner",
    duration: "4 weeks",
    students: 2100,
    rating: 4.9,
  },
  {
    id: 4,
    title: "Data Science Essentials",
    description: "Introduction to data analysis and visualization techniques.",
    level: "Intermediate",
    duration: "10 weeks",
    students: 750,
    rating: 4.7,
  },
];

const HomeCourses = () => {
  return (
    <MainPageLayout>
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <Title level={2} style={{ color: "#1890ff" }}>
          Our Courses
        </Title>
        <Paragraph style={{ fontSize: 18, maxWidth: 800, margin: "0 auto" }}>
          Choose from our wide range of courses designed to help you achieve
          your goals.
        </Paragraph>
      </div>

      <Row gutter={[24, 24]}>
        {courses.map((course) => (
          <Col key={course.id} xs={24} sm={12} lg={6}>
            <Card
              hoverable
              cover={
                <div
                  style={{
                    height: 160,
                    background: "#1890ff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Title level={3} style={{ color: "#fff" }}>
                    {course.title.split(" ")[0]}
                  </Title>
                </div>
              }
              actions={[
                <Button type="primary" block>
                  Enroll Now
                </Button>,
              ]}
            >
              <Card.Meta
                title={course.title}
                description={
                  <>
                    <Paragraph ellipsis={{ rows: 2 }}>
                      {course.description}
                    </Paragraph>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: 16,
                      }}
                    >
                      <Tag color="blue">{course.level}</Tag>
                      <div>
                        <span style={{ marginRight: 8 }}>
                          <ClockCircleOutlined /> {course.duration}
                        </span>
                        <span>
                          <UserOutlined /> {course.students.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div style={{ marginTop: 8 }}>
                      <StarFilled style={{ color: "#faad14" }} />{" "}
                      {course.rating}
                    </div>
                  </>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>
    </MainPageLayout>
  );
};

export default HomeCourses;
