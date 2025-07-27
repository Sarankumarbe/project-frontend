import MainPageLayout from "../layouts/MainPageLayout";
import {
  Typography,
  Row,
  Col,
  Card,
  Button,
  Tag,
  Spin,
  Alert,
  Image,
  Modal,
} from "antd";
import {
  FileTextOutlined,
  ClockCircleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useGetAllCoursesQuery } from "../store/api/userApi";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const { Title, Paragraph } = Typography;

const HomeCourses = () => {
  const { data: courseData, isLoading, isError } = useGetAllCoursesQuery();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <MainPageLayout>
        <Spin
          size="large"
          style={{ display: "flex", justifyContent: "center", marginTop: 48 }}
        />
      </MainPageLayout>
    );
  }

  if (isError) {
    return (
      <MainPageLayout>
        <Alert
          message="Error"
          description="Failed to load courses. Please try again later."
          type="error"
          showIcon
          style={{ margin: 48 }}
        />
      </MainPageLayout>
    );
  }

  const handleBuyClick = (course) => {
    const userInfo = localStorage.getItem("userInfo");
    if (!userInfo) {
      navigate("/login");
    } else {
      navigate("/cart", { state: { course } });
    }
  };

  const handleViewCourse = (course) => {
    setSelectedCourse(course);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedCourse(null);
  };

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
        {courseData?.courses?.map((course) => (
          <Col key={course._id} xs={24} sm={12} lg={6}>
            <Card
              hoverable
              cover={
                course.image ? (
                  <Image
                    src={`/${course.image}`}
                    alt={course.title}
                    height={160}
                    style={{ objectFit: "cover" }}
                    preview={false}
                  />
                ) : (
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
                )
              }
              actions={[
                <Button
                  type="primary"
                  block
                  onClick={() => handleBuyClick(course)}
                >
                  Buy ₹ {course.price}
                </Button>,
                <Button
                  block
                  icon={<EyeOutlined />}
                  onClick={() => handleViewCourse(course)}
                >
                  View Course
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
                      <Tag color={course.is_active ? "green" : "red"}>
                        {course.is_active ? "Active" : "Inactive"}
                      </Tag>
                      <div>
                        <span style={{ marginRight: 8 }}>₹ {course.price}</span>
                      </div>
                    </div>
                    <div style={{ marginTop: 8 }}>
                      <FileTextOutlined /> Question Papers:{" "}
                      {course.questionPapers?.length || 0}
                    </div>
                    {course.questionPapers?.length > 0 && (
                      <div style={{ marginTop: 8 }}>
                        <ClockCircleOutlined /> Paper Duration:{" "}
                        {course.questionPapers[0].duration} mins
                      </div>
                    )}
                  </>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Course Details Modal */}
      <Modal
        title={selectedCourse?.title}
        visible={modalVisible}
        onCancel={handleModalClose}
        footer={[
          <Button key="back" onClick={handleModalClose}>
            Close
          </Button>,
          <Button
            key="buy"
            type="primary"
            onClick={() => {
              handleModalClose();
              handleBuyClick(selectedCourse);
            }}
          >
            Buy ₹{selectedCourse?.price}
          </Button>,
        ]}
        width={800}
      >
        {selectedCourse && (
          <div>
            <div style={{ marginBottom: 16 }}>
              {selectedCourse.image && (
                <Image
                  src={`/${selectedCourse.image}`}
                  alt={selectedCourse.title}
                  width="100%"
                  style={{ maxHeight: 300, objectFit: "contain" }}
                />
              )}
            </div>
            <Paragraph>{selectedCourse.description}</Paragraph>
            <div style={{ marginTop: 16 }}>
              <Tag color={selectedCourse.is_active ? "green" : "red"}>
                {selectedCourse.is_active ? "Active" : "Inactive"}
              </Tag>
              <Tag>₹ {selectedCourse.price}</Tag>
            </div>

            <Title level={4} style={{ marginTop: 24 }}>
              Question Papers
            </Title>
            {selectedCourse.questionPapers?.length > 0 ? (
              <ul>
                {selectedCourse.questionPapers.map((paper, index) => (
                  <li key={index}>
                    <strong>{paper.title}</strong> - Duration: {paper.duration}{" "}
                    mins
                  </li>
                ))}
              </ul>
            ) : (
              <Paragraph>No question papers available</Paragraph>
            )}
          </div>
        )}
      </Modal>
    </MainPageLayout>
  );
};

export default HomeCourses;
