import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetSubmissionQuery } from "../../store/api/userApi";
import UserMainLayout from "../Components/UserMainLayout";
import {
  Card,
  Typography,
  Divider,
  Table,
  Tag,
  Spin,
  message,
  Space,
  Row,
  Col,
  Button,
} from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../store/slices/authSlice";

const { Title, Text } = Typography;

const UserSubmission = () => {
  const user = useSelector(selectCurrentUser);
  const { questionPaperId } = useParams();
  const navigate = useNavigate();

  console.log("Question Paper ID from route:", questionPaperId);

  const {
    data: submissionData,
    isLoading,
    isError,
    error,
  } = useGetSubmissionQuery(
    // Only pass questionPaperId since that's what the API expects
    { questionPaperId: questionPaperId },
    {
      skip: !questionPaperId || !user?._id,
    }
  );

  if (!questionPaperId) {
    return (
      <UserMainLayout>
        <Card>
          <Text type="danger">Error: Missing Question Paper ID in URL</Text>
          <Text>
            Please ensure you're accessing this page from a valid test
            submission link.
          </Text>
          <Button
            type="primary"
            onClick={() => navigate(-1)}
            style={{ marginTop: 16 }}
          >
            Go Back
          </Button>
        </Card>
      </UserMainLayout>
    );
  }

  if (isLoading) {
    return (
      <UserMainLayout>
        <Card>
          <Spin size="large" />
        </Card>
      </UserMainLayout>
    );
  }

  if (isError) {
    console.error("Submission error:", error);
    return (
      <UserMainLayout>
        <Card>
          <Title level={4} type="danger">
            Error Loading Submission
          </Title>
          <Text>
            {error?.data?.message || "Failed to load submission details"}
          </Text>
          <Button
            type="primary"
            onClick={() => navigate(-1)}
            style={{ marginTop: 16 }}
          >
            Go Back
          </Button>
        </Card>
      </UserMainLayout>
    );
  }

  if (!submissionData) {
    return (
      <UserMainLayout>
        <Card>
          <Title level={4}>No Submission Found</Title>
          <Text>
            You haven't submitted this test yet or the submission data is
            unavailable.
          </Text>
          <Button
            type="primary"
            onClick={() => navigate(-1)}
            style={{ marginTop: 16 }}
          >
            Go Back
          </Button>
        </Card>
      </UserMainLayout>
    );
  }

  // Destructure submission data with fallbacks
  const { answers = [], totalMarks = 0, submittedAt } = submissionData;
  const questionCount = answers.length;

  // Calculate statistics
  const correctAnswers = answers.filter((a) => a.isCorrect).length;
  const incorrectAnswers = questionCount - correctAnswers;
  const percentage =
    questionCount > 0 ? Math.round((totalMarks / questionCount) * 100) : 0;

  // Table columns configuration
  const columns = [
    {
      title: "Question",
      dataIndex: "questionNumber",
      key: "questionNumber",
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: "Your Answer",
      dataIndex: "selectedAnswer",
      key: "selectedAnswer",
      render: (selectedAnswer, record) => (
        <Space>
          <Tag
            color={record.isCorrect ? "green" : "red"}
            icon={
              record.isCorrect ? (
                <CheckCircleOutlined />
              ) : (
                <CloseCircleOutlined />
              )
            }
          >
            {selectedAnswer || "Not answered"}
          </Tag>
          {!record.isCorrect && record.selectedAnswer && (
            <Text type="secondary">
              (Correct answer: {record.correctAnswer})
            </Text>
          )}
        </Space>
      ),
    },
    {
      title: "Result",
      dataIndex: "isCorrect",
      key: "isCorrect",
      render: (isCorrect) => (
        <Text strong type={isCorrect ? "success" : "danger"}>
          {isCorrect ? "Correct" : "Incorrect"}
        </Text>
      ),
    },
    {
      title: "Marks",
      dataIndex: "marksAwarded",
      key: "marksAwarded",
      render: (marks) => (
        <Text strong type={marks > 0 ? "success" : "danger"}>
          {marks > 0 ? `+${marks}` : marks}
        </Text>
      ),
    },
  ];

  return (
    <UserMainLayout>
      <Card>
        <Title level={3}>Test Submission Details</Title>
        <Divider />

        <div style={{ marginBottom: 24 }}>
          <Title level={4}>Test Results</Title>
          <Text>Submitted on: {new Date(submittedAt).toLocaleString()}</Text>

          <Row gutter={16} style={{ marginTop: 16 }}>
            <Col span={8}>
              <Card size="small">
                <Text strong>Total Questions: </Text>
                <Text>{questionCount}</Text>
              </Card>
            </Col>
            <Col span={8}>
              <Card size="small">
                <Text strong>Correct Answers: </Text>
                <Text type="success">{correctAnswers}</Text>
              </Card>
            </Col>
            <Col span={8}>
              <Card size="small">
                <Text strong>Incorrect Answers: </Text>
                <Text type="danger">{incorrectAnswers}</Text>
              </Card>
            </Col>
          </Row>

          <Row gutter={16} style={{ marginTop: 16 }}>
            <Col span={24}>
              <Card size="small">
                <Text strong>Total Score: </Text>
                <Text type={percentage >= 50 ? "success" : "danger"}>
                  {totalMarks} points ({percentage}%)
                </Text>
              </Card>
            </Col>
          </Row>
        </div>

        <Divider orientation="left">Your Answers</Divider>

        <Table
          columns={columns}
          dataSource={answers.map((answer) => ({
            ...answer,
            // Add correctAnswer to each answer if not already present
            correctAnswer: answer.correctAnswer || "N/A",
          }))}
          rowKey="_id"
          pagination={false}
          bordered
          style={{ marginTop: 16 }}
        />
      </Card>
    </UserMainLayout>
  );
};

export default UserSubmission;
