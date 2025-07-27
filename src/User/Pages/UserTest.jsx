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
} from "antd";
import UserMainLayout from "../Components/UserMainLayout";
import { useParams, useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const UserTest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(60 * 60); // 60 minutes in seconds
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Sample test data - replace with API call
  const testData = {
    id: id,
    title: "Algebra Basics - Test 1",
    totalMarks: 100,
    passingMarks: 40,
    questions: [
      {
        id: "q1",
        text: "What is the solution to 2x + 5 = 15?",
        options: [
          { id: "a", text: "5" },
          { id: "b", text: "10" },
          { id: "c", text: "7.5" },
          { id: "d", text: "2" },
        ],
        correctAnswer: "a",
        marks: 5,
      },
      {
        id: "q2",
        text: "Simplify: 3(x + 4) - 2x",
        options: [
          { id: "a", text: "x + 12" },
          { id: "b", text: "5x + 4" },
          { id: "c", text: "3x + 10" },
          { id: "d", text: "x + 4" },
        ],
        correctAnswer: "a",
        marks: 5,
      },
      // Add more questions...
    ],
    duration: 60, // minutes
  };

  // Calculate progress information
  const totalQuestions = testData.questions.length;
  const answeredQuestions = Object.keys(answers).length;
  const unansweredQuestions = totalQuestions - answeredQuestions;
  const isCurrentAnswered =
    answers[testData.questions[currentQuestion]?.id] !== undefined;
  const progressPercentage = Math.round(
    (answeredQuestions / totalQuestions) * 100
  );

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleNext = () => {
    // Save current answer before moving
    if (selectedOption !== null) {
      setAnswers((prev) => ({
        ...prev,
        [testData.questions[currentQuestion].id]: selectedOption,
      }));
    }

    // Move to next question
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

  const handleSubmit = () => {
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

    // Show submission modal
    setIsModalVisible(true);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <UserMainLayout>
      <Card title={testData.title}>
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
                  {option.text}
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

      {/* Submission Modal */}
      <Modal
        title="Test Submitted Successfully"
        visible={isModalVisible}
        onOk={() => navigate("/user-course")}
        onCancel={() => navigate("/user-course")}
        cancelButtonProps={{ style: { display: "none" } }}
        okText="Back to Courses"
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
