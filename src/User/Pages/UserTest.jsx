import { useState, useEffect } from "react";
import {
  Card,
  Button,
  Radio,
  Space,
  Typography,
  Progress,
  Divider,
  Modal,
  Row,
  Col,
  Tag,
  Alert,
  message,
  Spin,
} from "antd";
import UserMainLayout from "../Components/UserMainLayout";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetQuestionPaperForPurchasedUserQuery,
  useSubmitAnswersMutation,
} from "../../store/api/userApi";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../store/slices/authSlice";

const { Title, Text } = Typography;

const UserTest = () => {
  const { id: questionPaperId } = useParams();
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [lowTimeAlert, setLowTimeAlert] = useState(false);

  const {
    data: testData,
    isLoading,
    isError,
    error,
  } = useGetQuestionPaperForPurchasedUserQuery(
    { questionPaperId, userId: user?._id },
    { skip: !user?._id }
  );

  const [submitAnswers, { isLoading: isSubmitting }] =
    useSubmitAnswersMutation();

  useEffect(() => {
    if (isError) {
      message.error(error?.data?.error || "Failed to load test");
      navigate(-1);
    }
  }, [isError, error, navigate]);

  useEffect(() => {
    if (testData) {
      // Initialize timer with duration from question paper (convert minutes to seconds)
      setTimeLeft(testData.duration * 60);
    }
  }, [testData]);

  // Calculate progress information
  const totalQuestions = testData?.questions?.length || 0;
  const answeredQuestions = Object.keys(answers).length;
  const unansweredQuestions = totalQuestions - answeredQuestions;
  const isCurrentAnswered =
    testData?.questions &&
    answers[testData.questions[currentQuestion]?.id] !== undefined;
  const progressPercentage =
    totalQuestions > 0
      ? Math.round((answeredQuestions / totalQuestions) * 100)
      : 0;

  // Timer effect
  useEffect(() => {
    if (!testData || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;

        // Show low time alert when under 5 minutes
        if (newTime <= 300 && !lowTimeAlert) {
          setLowTimeAlert(true);
          message.warning(
            "Less than 5 minutes remaining! Please complete your test soon."
          );
        }

        if (newTime <= 0) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [testData, timeLeft]);

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleNext = () => {
    if (selectedOption !== null) {
      setAnswers((prev) => ({
        ...prev,
        [testData.questions[currentQuestion].id]: selectedOption,
      }));
    }
    setCurrentQuestion((prev) => prev + 1);
    setSelectedOption(
      answers[testData.questions[currentQuestion + 1]?.id] || null
    );
  };

  const handlePrevious = () => {
    setCurrentQuestion((prev) => prev - 1);
    setSelectedOption(
      answers[testData.questions[currentQuestion - 1]?.id] || null
    );
  };

  const handleAutoSubmit = () => {
    // Save current answer if not already saved
    const currentQuestionId = testData.questions[currentQuestion]?.id;
    if (
      selectedOption !== null &&
      currentQuestionId &&
      !answers[currentQuestionId]
    ) {
      setAnswers((prev) => ({
        ...prev,
        [currentQuestionId]: selectedOption,
      }));
    }
    setIsModalVisible(true);
  };

  const handleSubmit = () => {
    setIsConfirmModalVisible(true);
  };

  const confirmSubmit = async () => {
    setIsConfirmModalVisible(false);

    try {
      // Transform answers to include question numbers
      const answersPayload = testData.questions
        .filter((question) => answers[question.id] !== undefined)
        .map((question) => ({
          questionNumber: question.questionNumber,
          selectedAnswer: answers[question.id],
        }));

      await submitAnswers({
        userId: user._id,
        questionPaperId,
        answers: answersPayload,
        timeTaken: testData.duration * 60 - timeLeft,
      }).unwrap();

      handleAutoSubmit();
      message.success("Answers submitted successfully!");
    } catch (error) {
      message.error(error?.data?.message || "Failed to submit answers");
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  if (isLoading) {
    return (
      <UserMainLayout>
        <Card>
          <Spin size="large" />
        </Card>
      </UserMainLayout>
    );
  }

  if (!testData) {
    return (
      <UserMainLayout>
        <Card>
          <Text>No test data available</Text>
        </Card>
      </UserMainLayout>
    );
  }

  return (
    <UserMainLayout>
      <Card title={testData.title}>
        {lowTimeAlert && timeLeft > 0 && (
          <Alert
            message="Hurry! Less than 5 minutes remaining"
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        {/* Test Information Row */}
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={8}>
            <Card size="small">
              <Text strong>Total Questions: </Text>
              <Tag color="blue">{totalQuestions}</Tag>
            </Card>
          </Col>
          <Col span={8}>
            <Card size="small">
              <Text strong>Answered: </Text>
              <Tag color="green">{answeredQuestions}</Tag>
            </Card>
          </Col>
          <Col span={8}>
            <Card size="small">
              <Text strong>Unanswered: </Text>
              <Tag color="orange">{unansweredQuestions}</Tag>
            </Card>
          </Col>
        </Row>

        {/* Progress and Timer Row */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={12}>
            <Card size="small">
              <Text strong>Progress: </Text>
              <Progress
                percent={progressPercentage}
                status="active"
                style={{ display: "inline-block", width: "60%", marginLeft: 8 }}
              />
              <Text style={{ marginLeft: 8 }}>{progressPercentage}%</Text>
            </Card>
          </Col>
          <Col span={12}>
            <Card size="small">
              <Text strong>Time Remaining: </Text>
              <Tag color={timeLeft < 300 ? "red" : "green"}>
                {formatTime(timeLeft)}
              </Tag>
            </Card>
          </Col>
        </Row>

        {/* Current Question Status */}
        <div style={{ marginBottom: 8 }}>
          <Tag color={isCurrentAnswered ? "green" : "orange"}>
            {isCurrentAnswered ? "Answered" : "Not Answered"}
          </Tag>
          <Text strong style={{ marginLeft: 8 }}>
            Question {currentQuestion + 1} of {totalQuestions}
            (Marks: {testData.questions[currentQuestion].marks})
          </Text>
        </div>

        {/* Question and Options */}
        <div style={{ marginBottom: 24 }}>
          <Title level={4} style={{ marginBottom: 16 }}>
            {testData.questions[currentQuestion].questionNumber}:{" "}
            {testData.questions[currentQuestion].text}
          </Title>
          <Radio.Group
            onChange={handleOptionChange}
            value={selectedOption}
            style={{ width: "100%" }}
          >
            <Space direction="vertical">
              {testData.questions[currentQuestion].options.map((option) => (
                <Radio key={option.id} value={option.id}>
                  {option.id.toUpperCase()}. {option.text}
                </Radio>
              ))}
            </Space>
          </Radio.Group>
        </div>

        {/* Navigation Buttons */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Button onClick={handlePrevious} disabled={currentQuestion === 0}>
            Previous
          </Button>

          {currentQuestion < testData.questions.length - 1 ? (
            <Button type="primary" onClick={handleNext}>
              Next
            </Button>
          ) : (
            <Button type="primary" danger onClick={handleSubmit}>
              Submit Test
            </Button>
          )}
        </div>
      </Card>

      {/* Confirmation Modal */}
      <Modal
        title="Confirm Submission"
        visible={isConfirmModalVisible}
        onOk={confirmSubmit}
        onCancel={() => setIsConfirmModalVisible(false)}
        okText="Submit"
        cancelText="Cancel"
      >
        <Text>Are you sure you want to submit the test?</Text>
        {unansweredQuestions > 0 && (
          <Alert
            message={`You have ${unansweredQuestions} unanswered questions`}
            type="warning"
            showIcon
            style={{ marginTop: 16 }}
          />
        )}
      </Modal>

      {/* Submission Modal */}
      <Modal
        title="Test Submitted Successfully"
        visible={isModalVisible}
        onOk={() => navigate("/user-course")}
        footer={[
          <Button
            key="back"
            type="primary"
            onClick={() => navigate("/user-course")}
          >
            Back to Courses
          </Button>,
        ]}
      >
        <div style={{ textAlign: "center" }}>
          <Title level={4}>Test Summary</Title>
          <p>
            <Text strong>Total Questions: </Text>
            <Text>{totalQuestions}</Text>
          </p>
          <p>
            <Text strong>Answered: </Text>
            <Text>{answeredQuestions}</Text>
          </p>
          <p>
            <Text strong>Unanswered: </Text>
            <Text>{unansweredQuestions}</Text>
          </p>
          <Divider />
          <Text type="secondary">
            You'll be notified when your results are available.
          </Text>
        </div>
      </Modal>
    </UserMainLayout>
  );
};

export default UserTest;
