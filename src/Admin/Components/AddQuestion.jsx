import { useState, useEffect } from "react";
import {
  Upload,
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  Card,
  Row,
  Col,
  Divider,
  message,
  Spin,
  Image,
  Modal,
  Space,
  Tag,
  Tooltip,
  Alert,
  Typography,
  Collapse,
  Descriptions,
} from "antd";
import {
  UploadOutlined,
  PictureOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SaveOutlined,
  PlusOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import AdminMainLayout from "../Components/AdminMainLayout";
import { pdfjs } from "react-pdf";
import pdfParse from "pdf-parse/lib/pdf-parse.js";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const { Option } = Select;
const { TextArea } = Input;
const { Title, Text } = Typography;
const { Panel } = Collapse;

const AddQuestion = () => {
  const [form] = Form.useForm();
  const [fileContent, setFileContent] = useState(null);
  const [parsedQuestions, setParsedQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [currentImageField, setCurrentImageField] = useState("");
  const [searchText, setSearchText] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("all");
  const [saveStatus, setSaveStatus] = useState({});

  const parseQuestionPaper = (text) => {
    const questions = [];
    const cleanText = text
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    // Enhanced question pattern matching
    const questionPatterns = [
      /(Q\d+\.\s)/g, // Q1.
      /(Question\s+\d+[:.]?\s)/gi, // Question 1: or Question 1.
      /(\d+\.\s)/g, // 1.
      /(^\s*\(\d+\)\s)/gm, // (1)
      /(^\s*\[?\d+\]?\s)/gm, // [1] or 1
    ];

    let questionMatches = [];
    let usedPattern = null;

    // Find the best matching pattern
    for (const pattern of questionPatterns) {
      const matches = [...cleanText.matchAll(pattern)];
      if (matches.length > 5) {
        // Require at least 5 matches to consider it valid
        questionMatches = matches;
        usedPattern = pattern;
        break;
      }
    }

    if (questionMatches.length === 0) {
      // Fallback to splitting by answer options
      return parseByAnswerOptions(cleanText);
    }

    // Split text by question positions
    for (let i = 0; i < questionMatches.length; i++) {
      try {
        const currentMatch = questionMatches[i];
        const nextMatch = questionMatches[i + 1];

        const startPos = currentMatch.index;
        const endPos = nextMatch ? nextMatch.index : cleanText.length;

        let questionBlock = cleanText.substring(startPos, endPos).trim();

        // Skip very short blocks or those that don't look like questions
        if (questionBlock.length < 20 || !/[a-zA-Z]/.test(questionBlock))
          continue;

        // Clean up the question block
        questionBlock = questionBlock
          .replace(/^\s*[\(\[]?\d+[\)\]]?\s*/, "")
          .replace(/^Q\d+\.?\s*/, "")
          .replace(/^Question\s+\d+[:.]?\s*/i, "")
          .trim();

        const parsedQuestion = parseIndividualQuestion(questionBlock, i + 1);
        if (parsedQuestion) {
          questions.push(parsedQuestion);
        }
      } catch (error) {
        console.error(`Error parsing question ${i + 1}:`, error);
        continue;
      }
    }

    return questions;
  };

  const parseIndividualQuestion = (questionBlock, questionIndex) => {
    try {
      // Extract question text (everything until first option)
      const questionTextMatch = questionBlock.match(
        /^[\s\S]*?(?=\n\s*[A-E][\)\.])/i
      );
      let questionText = questionTextMatch
        ? questionTextMatch[0].trim()
        : questionBlock;

      // Extract options with more flexible patterns
      const options = {};
      const optionLetters = ["A", "B", "C", "D", "E"];

      optionLetters.forEach((letter) => {
        const patterns = [
          new RegExp(`${letter}[\)\.]\\s*([^\\n]*)(?=\\n|$)`, "i"),
          new RegExp(`\\n${letter}[\)\.]\\s*([^\\n]*)`, "i"),
          new RegExp(`\\n\\s*${letter}\\.?\\s+([^\\n]*)`, "i"),
        ];

        for (const pattern of patterns) {
          const optionMatch = questionBlock.match(pattern);
          if (optionMatch && optionMatch[1].trim()) {
            options[letter] = {
              text: optionMatch[1].trim(),
              image: null,
            };
            break;
          }
        }
      });

      // Extract correct answer with multiple patterns
      const correctAnswerPatterns = [
        /Correct\s+Answer\s*:\s*([A-E])/i,
        /Answer\s*:\s*([A-E])/i,
        /Ans\s*:\s*([A-E])/i,
        /\(?\s*([A-E])\s*\)?\s*(?:is\s+correct|correct\s+answer)/i,
      ];

      let correctAnswer = "";
      for (const pattern of correctAnswerPatterns) {
        const match = questionBlock.match(pattern);
        if (match) {
          correctAnswer = match[1].toUpperCase();
          break;
        }
      }

      // Extract difficulty
      const difficultyMatch = questionBlock.match(
        /Difficulty\s*(?:Level)?\s*:\s*(\w+)/i
      );
      let difficulty = difficultyMatch
        ? difficultyMatch[1].charAt(0).toUpperCase() +
          difficultyMatch[1].slice(1).toLowerCase()
        : "Easy";

      // Extract explanation
      const explanationMatch = questionBlock.match(
        /Explanation\s*:\s*([\s\S]*?)(?=\n\s*(?:Q\d|$))/i
      );
      const explanation = explanationMatch ? explanationMatch[1].trim() : "";

      return {
        id: `q_${Date.now()}_${questionIndex}`,
        questionNumber: `Q${questionIndex}`,
        questionText,
        questionImage: null,
        options,
        correctAnswer,
        difficulty,
        explanation,
        marks: 1,
        negativeMarks: 0.25,
        hasImages: false,
        isEdited: false,
      };
    } catch (error) {
      console.error(`Error parsing question ${questionIndex}:`, error);
      return null;
    }
  };

  const parseByAnswerOptions = (text) => {
    console.log("Trying alternative parsing by answer options...");
    const questions = [];

    // Split by option A) patterns
    const sections = text.split(/(?=\n\s*A\))/);

    sections.forEach((section, index) => {
      if (index === 0) return; // Skip first section which might be header

      try {
        const questionText = section.split(/\n\s*A\)/)[0].trim();
        if (questionText.length < 10) return;

        const question = parseIndividualQuestion(section, index);
        if (question) {
          questions.push(question);
        }
      } catch (error) {
        console.error(
          `Error in alternative parsing for section ${index}:`,
          error
        );
      }
    });

    return questions;
  };

  const handleFileUpload = async (file) => {
    setIsLoading(true);
    setParsedQuestions([]);
    setActiveQuestionIndex(0);
    form.resetFields();

    try {
      let content = "";

      if (file.name.toLowerCase().endsWith(".pdf")) {
        // For PDF files
        const arrayBuffer = await file.arrayBuffer();
        const data = await pdfParse(arrayBuffer);
        content = data.text;

        if (!content.trim()) {
          message.error(
            "Couldn't extract text from PDF. It might be a scanned image."
          );
          setIsLoading(false);
          return;
        }
      } else {
        // For text files
        content = await file.text();
      }

      if (!content.trim()) {
        message.error("The uploaded file appears to be empty or unreadable.");
        setIsLoading(false);
        return;
      }

      setFileContent(content);
      const parsed = parseQuestionPaper(content);

      if (parsed.length === 0) {
        Modal.error({
          title: "No Questions Found",
          content: (
            <div>
              <p>
                Could not parse questions from the uploaded file. Please check:
              </p>
              <ul>
                <li>Questions are numbered (Q1., Q2., 1., 2., etc.)</li>
                <li>Options are labeled with A), B), C), D), E)</li>
                <li>File contains selectable text (not scanned image)</li>
              </ul>
            </div>
          ),
        });
      } else {
        setParsedQuestions(parsed);
        setActiveQuestionIndex(0);
        form.setFieldsValue(parsed[0]);
        message.success(`Successfully parsed ${parsed.length} questions!`, 5);
      }
    } catch (error) {
      console.error("Error processing file:", error);
      message.error(`Error processing file: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (file, fieldType, optionKey = null) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target.result;
      const updatedQuestions = [...parsedQuestions];
      const currentQuestion = updatedQuestions[activeQuestionIndex];

      if (fieldType === "question") {
        currentQuestion.questionImage = imageUrl;
      } else if (fieldType === "option" && optionKey) {
        if (!currentQuestion.options[optionKey]) {
          currentQuestion.options[optionKey] = { text: "", image: null };
        }
        currentQuestion.options[optionKey].image = imageUrl;
      }

      currentQuestion.hasImages = true;
      currentQuestion.isEdited = true;
      setParsedQuestions(updatedQuestions);
      form.setFieldsValue(currentQuestion);
      setImageModalVisible(false);
      message.success("Image uploaded successfully!");
    };

    reader.readAsDataURL(file);
    return false;
  };

  const handleQuestionSelect = (index) => {
    form
      .validateFields()
      .then((values) => {
        const updatedQuestions = [...parsedQuestions];
        updatedQuestions[activeQuestionIndex] = {
          ...updatedQuestions[activeQuestionIndex],
          ...values,
          isEdited: true,
        };
        setParsedQuestions(updatedQuestions);

        setActiveQuestionIndex(index);
        form.setFieldsValue(parsedQuestions[index]);
      })
      .catch(() => {
        setActiveQuestionIndex(index);
        form.setFieldsValue(parsedQuestions[index]);
      });
  };

  const handleSubmit = (values) => {
    const updatedQuestions = [...parsedQuestions];
    updatedQuestions[activeQuestionIndex] = {
      ...updatedQuestions[activeQuestionIndex],
      ...values,
      isEdited: true,
    };
    setParsedQuestions(updatedQuestions);

    setSaveStatus((prev) => ({ ...prev, [activeQuestionIndex]: true }));
    message.success("Question saved successfully!");

    const nextUnsavedIndex = updatedQuestions.findIndex(
      (q, idx) => idx > activeQuestionIndex && !saveStatus[idx]
    );
    if (nextUnsavedIndex !== -1) {
      setTimeout(() => handleQuestionSelect(nextUnsavedIndex), 500);
    }
  };

  const removeImage = (fieldType, optionKey = null) => {
    const updatedQuestions = [...parsedQuestions];
    const currentQuestion = updatedQuestions[activeQuestionIndex];

    if (fieldType === "question") {
      currentQuestion.questionImage = null;
    } else if (fieldType === "option" && optionKey) {
      if (currentQuestion.options[optionKey]) {
        currentQuestion.options[optionKey].image = null;
      }
    }

    const hasQuestionImage = currentQuestion.questionImage;
    const hasOptionImages = Object.values(currentQuestion.options).some(
      (opt) => opt?.image
    );
    currentQuestion.hasImages = hasQuestionImage || hasOptionImages;
    currentQuestion.isEdited = true;

    setParsedQuestions(updatedQuestions);
    form.setFieldsValue(currentQuestion);
    message.success("Image removed successfully!");
  };

  const addNewQuestion = () => {
    const newQuestion = {
      id: `q_${Date.now()}_new`,
      questionNumber: `Q${parsedQuestions.length + 1}`,
      questionText: "",
      questionImage: null,
      options: {
        A: { text: "", image: null },
        B: { text: "", image: null },
        C: { text: "", image: null },
        D: { text: "", image: null },
        E: { text: "", image: null },
      },
      correctAnswer: "",
      difficulty: "Easy",
      explanation: "",
      marks: 1,
      negativeMarks: 0.25,
      hasImages: false,
      isEdited: false,
    };

    const updatedQuestions = [...parsedQuestions, newQuestion];
    setParsedQuestions(updatedQuestions);
    setActiveQuestionIndex(updatedQuestions.length - 1);
    form.setFieldsValue(newQuestion);
    message.success("New question added!");
  };

  const deleteQuestion = (index) => {
    Modal.confirm({
      title: "Delete Question",
      content: "Are you sure you want to delete this question?",
      okType: "danger",
      onOk: () => {
        const updatedQuestions = parsedQuestions.filter((_, i) => i !== index);
        setParsedQuestions(updatedQuestions);

        if (updatedQuestions.length === 0) {
          setActiveQuestionIndex(0);
          form.resetFields();
        } else if (index <= activeQuestionIndex) {
          const newIndex = Math.max(0, activeQuestionIndex - 1);
          setActiveQuestionIndex(newIndex);
          form.setFieldsValue(updatedQuestions[newIndex]);
        }

        message.success("Question deleted successfully!");
      },
    });
  };

  const submitAllQuestions = () => {
    if (parsedQuestions.length === 0) {
      message.warning("No questions to submit!");
      return;
    }

    const invalidQuestions = parsedQuestions.filter(
      (q) =>
        !q.questionText ||
        !q.correctAnswer ||
        Object.values(q.options).some((opt) => !opt?.text)
    );

    if (invalidQuestions.length > 0) {
      message.error(
        `Please complete all required fields. ${invalidQuestions.length} questions are incomplete.`
      );
      return;
    }

    Modal.confirm({
      title: "Submit Question Paper",
      content: `Are you sure you want to submit ${parsedQuestions.length} questions?`,
      onOk: () => {
        // Just display the parsed data in console instead of making API call
        console.log("Questions to be submitted:", parsedQuestions);
        message.success(
          `Question paper with ${parsedQuestions.length} questions processed successfully! Check console for data.`
        );
      },
    });
  };

  const filteredQuestions = parsedQuestions.filter((q, index) => {
    const matchesSearch =
      q.questionText.toLowerCase().includes(searchText.toLowerCase()) ||
      q.questionNumber.toLowerCase().includes(searchText.toLowerCase());
    const matchesDifficulty =
      filterDifficulty === "all" || q.difficulty === filterDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  const uploadProps = {
    beforeUpload: handleFileUpload,
    accept: ".pdf,.doc,.docx,.txt",
    showUploadList: false,
  };

  const imageUploadProps = {
    beforeUpload: (file) =>
      handleImageUpload(
        file,
        currentImageField.type,
        currentImageField.optionKey
      ),
    accept: "image/*",
    showUploadList: false,
  };

  return (
    <AdminMainLayout>
      <div style={{ padding: "24px" }}>
        <Title level={2}>
          <FileTextOutlined /> Add Question Paper
        </Title>
        <Card title="Upload Question Paper" style={{ marginBottom: 24 }}>
          <Space direction="vertical" style={{ width: "100%" }}>
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />} size="large">
                Click to Upload Question Paper (PDF, Word, or Text)
              </Button>
            </Upload>

            {isLoading && (
              <div style={{ textAlign: "center", padding: "20px" }}>
                <Spin size="large" />
                <Text style={{ display: "block", marginTop: 16 }}>
                  Processing question paper...
                </Text>
              </div>
            )}

            {parsedQuestions.length > 0 && (
              <Alert
                message={`Successfully loaded ${parsedQuestions.length} questions`}
                type="success"
                showIcon
                action={
                  <Button size="small" onClick={addNewQuestion}>
                    <PlusOutlined /> Add New Question
                  </Button>
                }
              />
            )}
          </Space>
        </Card>
        {parsedQuestions.length > 0 && (
          <Row gutter={16}>
            <Col span={8}>
              <Card
                title={
                  <Space>
                    <span>Questions ({parsedQuestions.length})</span>
                    <Button
                      type="primary"
                      size="small"
                      icon={<PlusOutlined />}
                      onClick={addNewQuestion}
                    >
                      Add
                    </Button>
                  </Space>
                }
                extra={
                  <Space>
                    <Input.Search
                      placeholder="Search questions..."
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      style={{ width: 200 }}
                      size="small"
                    />
                    <Select
                      value={filterDifficulty}
                      onChange={setFilterDifficulty}
                      size="small"
                      style={{ width: 100 }}
                    >
                      <Option value="all">All</Option>
                      <Option value="Easy">Easy</Option>
                      <Option value="Medium">Medium</Option>
                      <Option value="Hard">Hard</Option>
                    </Select>
                  </Space>
                }
              >
                <div style={{ maxHeight: "70vh", overflowY: "auto" }}>
                  {filteredQuestions.map((q, originalIndex) => {
                    const actualIndex = parsedQuestions.indexOf(q);
                    return (
                      <div
                        key={q.id}
                        onClick={() => handleQuestionSelect(actualIndex)}
                        style={{
                          padding: "12px",
                          marginBottom: 8,
                          cursor: "pointer",
                          backgroundColor:
                            activeQuestionIndex === actualIndex
                              ? "#e6f7ff"
                              : "transparent",
                          borderRadius: 8,
                          border:
                            activeQuestionIndex === actualIndex
                              ? "2px solid #1890ff"
                              : "1px solid #f0f0f0",
                          transition: "all 0.2s",
                        }}
                      >
                        <Space direction="vertical" style={{ width: "100%" }}>
                          <Space
                            style={{
                              width: "100%",
                              justifyContent: "space-between",
                            }}
                          >
                            <Space>
                              <Text strong>{q.questionNumber}</Text>
                              <Tag
                                color={
                                  q.difficulty === "Easy"
                                    ? "green"
                                    : q.difficulty === "Medium"
                                    ? "orange"
                                    : "red"
                                }
                              >
                                {q.difficulty}
                              </Tag>
                              {q.hasImages && (
                                <Tooltip title="Contains images">
                                  <Tag color="blue">
                                    <PictureOutlined />
                                  </Tag>
                                </Tooltip>
                              )}
                              {q.isEdited && (
                                <Tooltip title="Edited">
                                  <Tag color="purple">
                                    <EditOutlined />
                                  </Tag>
                                </Tooltip>
                              )}
                              {saveStatus[actualIndex] && (
                                <Tooltip title="Saved">
                                  <Tag color="green">
                                    <CheckCircleOutlined />
                                  </Tag>
                                </Tooltip>
                              )}
                            </Space>
                            <Button
                              type="text"
                              danger
                              size="small"
                              icon={<DeleteOutlined />}
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteQuestion(actualIndex);
                              }}
                            />
                          </Space>

                          <Text
                            ellipsis={{ tooltip: q.questionText }}
                            style={{ fontSize: 14, marginRight: 8 }}
                          >
                            {q.questionText}
                          </Text>

                          <Space>
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              Correct:{" "}
                              <Text strong>{q.correctAnswer || "Not set"}</Text>
                            </Text>
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              Marks: <Text strong>{q.marks || 1}</Text>
                            </Text>
                          </Space>
                        </Space>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </Col>

            <Col span={16}>
              <Card
                title={
                  <Space>
                    <span>Edit Question {activeQuestionIndex + 1}</span>
                    {parsedQuestions[activeQuestionIndex]?.hasImages && (
                      <Tag color="blue">
                        <PictureOutlined /> Has Images
                      </Tag>
                    )}
                    {saveStatus[activeQuestionIndex] && (
                      <Tag color="green">
                        <CheckCircleOutlined /> Saved
                      </Tag>
                    )}
                  </Space>
                }
                extra={
                  <Space>
                    <Button
                      icon={<EyeOutlined />}
                      onClick={() => setPreviewVisible(true)}
                    >
                      Preview
                    </Button>
                    <Button
                      type="primary"
                      icon={<SaveOutlined />}
                      onClick={() => form.submit()}
                    >
                      Save Question
                    </Button>
                  </Space>
                }
              >
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleSubmit}
                  initialValues={{
                    marks: 1,
                    negativeMarks: 0.25,
                  }}
                >
                  <Collapse defaultActiveKey={["question", "options"]} ghost>
                    <Panel header="Question Details" key="question">
                      <Form.Item
                        name="questionText"
                        label="Question Text"
                        rules={[
                          {
                            required: true,
                            message: "Please enter question text",
                          },
                        ]}
                      >
                        <TextArea
                          rows={4}
                          placeholder="Enter the question text here..."
                        />
                      </Form.Item>

                      {parsedQuestions[activeQuestionIndex]?.questionImage && (
                        <div style={{ marginBottom: 16 }}>
                          <Text strong>Question Image:</Text>
                          <div
                            style={{
                              marginTop: 8,
                              position: "relative",
                              display: "inline-block",
                            }}
                          >
                            <Image
                              width={200}
                              src={
                                parsedQuestions[activeQuestionIndex]
                                  .questionImage
                              }
                              preview={{ visible: false }}
                              onClick={() =>
                                setPreviewImage(
                                  parsedQuestions[activeQuestionIndex]
                                    .questionImage
                                )
                              }
                            />
                            <Button
                              danger
                              size="small"
                              icon={<DeleteOutlined />}
                              style={{ position: "absolute", top: 4, right: 4 }}
                              onClick={() => removeImage("question")}
                            />
                          </div>
                        </div>
                      )}

                      <Button
                        icon={<PictureOutlined />}
                        onClick={() => {
                          setCurrentImageField({ type: "question" });
                          setImageModalVisible(true);
                        }}
                      >
                        {parsedQuestions[activeQuestionIndex]?.questionImage
                          ? "Change"
                          : "Add"}{" "}
                        Question Image
                      </Button>
                    </Panel>

                    <Panel header="Answer Options" key="options">
                      {["A", "B", "C", "D", "E"].map((option) => (
                        <div
                          key={option}
                          style={{
                            marginBottom: 16,
                            padding: 16,
                            border: "1px solid #f0f0f0",
                            borderRadius: 8,
                          }}
                        >
                          <Form.Item
                            name={["options", option, "text"]}
                            label={`Option ${option}`}
                            rules={[
                              {
                                required: true,
                                message: `Please enter option ${option}`,
                              },
                            ]}
                          >
                            <Input
                              placeholder={`Enter option ${option} text...`}
                            />
                          </Form.Item>

                          {parsedQuestions[activeQuestionIndex]?.options[option]
                            ?.image && (
                            <div style={{ marginBottom: 8 }}>
                              <Text strong>Option {option} Image:</Text>
                              <div
                                style={{
                                  marginTop: 4,
                                  position: "relative",
                                  display: "inline-block",
                                }}
                              >
                                <Image
                                  width={150}
                                  src={
                                    parsedQuestions[activeQuestionIndex]
                                      .options[option].image
                                  }
                                  preview={{ visible: false }}
                                  onClick={() =>
                                    setPreviewImage(
                                      parsedQuestions[activeQuestionIndex]
                                        .options[option].image
                                    )
                                  }
                                />
                                <Button
                                  danger
                                  size="small"
                                  icon={<DeleteOutlined />}
                                  style={{
                                    position: "absolute",
                                    top: 2,
                                    right: 2,
                                  }}
                                  onClick={() => removeImage("option", option)}
                                />
                              </div>
                            </div>
                          )}

                          <Button
                            size="small"
                            icon={<PictureOutlined />}
                            onClick={() => {
                              setCurrentImageField({
                                type: "option",
                                optionKey: option,
                              });
                              setImageModalVisible(true);
                            }}
                          >
                            {parsedQuestions[activeQuestionIndex]?.options[
                              option
                            ]?.image
                              ? "Change"
                              : "Add"}{" "}
                            Image
                          </Button>
                        </div>
                      ))}
                    </Panel>

                    <Panel header="Answer & Settings" key="settings">
                      <Row gutter={16}>
                        <Col span={12}>
                          <Form.Item
                            name="correctAnswer"
                            label="Correct Answer"
                            rules={[
                              {
                                required: true,
                                message: "Please select correct answer",
                              },
                            ]}
                          >
                            <Select placeholder="Select correct answer">
                              <Option value="A">A</Option>
                              <Option value="B">B</Option>
                              <Option value="C">C</Option>
                              <Option value="D">D</Option>
                              <Option value="E">E</Option>
                            </Select>
                          </Form.Item>
                        </Col>

                        <Col span={12}>
                          <Form.Item
                            name="difficulty"
                            label="Difficulty Level"
                            rules={[
                              {
                                required: true,
                                message: "Please select difficulty level",
                              },
                            ]}
                          >
                            <Select>
                              <Option value="Easy">Easy</Option>
                              <Option value="Medium">Medium</Option>
                              <Option value="Hard">Hard</Option>
                            </Select>
                          </Form.Item>
                        </Col>
                      </Row>

                      <Form.Item name="explanation" label="Explanation">
                        <TextArea
                          rows={3}
                          placeholder="Enter explanation for the correct answer..."
                        />
                      </Form.Item>

                      <Row gutter={16}>
                        <Col span={12}>
                          <Form.Item
                            name="marks"
                            label="Marks"
                            rules={[
                              { required: true, message: "Please enter marks" },
                            ]}
                          >
                            <InputNumber
                              min={0}
                              step={0.5}
                              style={{ width: "100%" }}
                            />
                          </Form.Item>
                        </Col>

                        <Col span={12}>
                          <Form.Item
                            name="negativeMarks"
                            label="Negative Marks"
                            rules={[
                              {
                                required: true,
                                message: "Please enter negative marks",
                              },
                            ]}
                          >
                            <InputNumber
                              min={0}
                              step={0.25}
                              style={{ width: "100%" }}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Panel>
                  </Collapse>
                </Form>
              </Card>
            </Col>
          </Row>
        )}
        {parsedQuestions.length > 0 && (
          <Card style={{ marginTop: 24, textAlign: "center" }}>
            <Space size={16}>
              <Text strong>Total Questions: {parsedQuestions.length}</Text>
              <Text>Saved: {Object.keys(saveStatus).length}</Text>
              <Text>
                With Images: {parsedQuestions.filter((q) => q.hasImages).length}
              </Text>
            </Space>
            <Divider />
            <Button
              type="primary"
              size="large"
              onClick={submitAllQuestions}
              disabled={parsedQuestions.length === 0}
            >
              Submit All Questions ({parsedQuestions.length})
            </Button>
          </Card>
        )}
        {/* Image Upload Modal */}
        <Modal
          title="Upload Image"
          visible={imageModalVisible}
          onCancel={() => setImageModalVisible(false)}
          footer={null}
        >
          <Upload {...imageUploadProps}>
            <Button
              icon={<UploadOutlined />}
              size="large"
              style={{ width: "100%" }}
            >
              Click to Upload Image
            </Button>
          </Upload>
          <Text
            type="secondary"
            style={{ display: "block", marginTop: 16, textAlign: "center" }}
          >
            Supported formats: JPG, PNG, GIF, SVG
          </Text>
        </Modal>
        {/* Image Preview Modal */}
        <Modal
          visible={previewVisible}
          title={`Question Preview: ${parsedQuestions[activeQuestionIndex]?.questionNumber}`}
          footer={null}
          onCancel={() => setPreviewVisible(false)}
          width={800}
        >
          {parsedQuestions[activeQuestionIndex] && (
            <div style={{ padding: 16 }}>
              <div style={{ marginBottom: 24 }}>
                <Text strong style={{ fontSize: 16 }}>
                  {parsedQuestions[activeQuestionIndex].questionNumber}:{" "}
                  {parsedQuestions[activeQuestionIndex].questionText}
                </Text>
                {parsedQuestions[activeQuestionIndex].questionImage && (
                  <div style={{ margin: "16px 0" }}>
                    <Image
                      src={parsedQuestions[activeQuestionIndex].questionImage}
                      style={{ maxWidth: "100%" }}
                    />
                  </div>
                )}
              </div>

              <Divider orientation="left">Options</Divider>
              <Space direction="vertical" style={{ width: "100%" }}>
                {["A", "B", "C", "D", "E"].map((option) => (
                  <Card
                    key={option}
                    size="small"
                    style={{
                      borderLeft:
                        parsedQuestions[activeQuestionIndex].correctAnswer ===
                        option
                          ? "4px solid #52c41a"
                          : "1px solid #f0f0f0",
                    }}
                  >
                    <Text strong>Option {option}:</Text>{" "}
                    {parsedQuestions[activeQuestionIndex].options[option]?.text}
                    {parsedQuestions[activeQuestionIndex].options[option]
                      ?.image && (
                      <div style={{ marginTop: 8 }}>
                        <Image
                          width={150}
                          src={
                            parsedQuestions[activeQuestionIndex].options[option]
                              .image
                          }
                        />
                      </div>
                    )}
                  </Card>
                ))}
              </Space>

              <Divider orientation="left">Details</Divider>
              <Descriptions bordered size="small" column={2}>
                <Descriptions.Item label="Correct Answer">
                  <Tag color="green">
                    {parsedQuestions[activeQuestionIndex].correctAnswer}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Difficulty">
                  <Tag
                    color={
                      parsedQuestions[activeQuestionIndex].difficulty === "Easy"
                        ? "green"
                        : parsedQuestions[activeQuestionIndex].difficulty ===
                          "Medium"
                        ? "orange"
                        : "red"
                    }
                  >
                    {parsedQuestions[activeQuestionIndex].difficulty}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Marks" span={2}>
                  {parsedQuestions[activeQuestionIndex].marks} (Negative:{" "}
                  {parsedQuestions[activeQuestionIndex].negativeMarks})
                </Descriptions.Item>
                {parsedQuestions[activeQuestionIndex].explanation && (
                  <Descriptions.Item label="Explanation" span={2}>
                    {parsedQuestions[activeQuestionIndex].explanation}
                  </Descriptions.Item>
                )}
              </Descriptions>
            </div>
          )}
        </Modal>
      </div>
    </AdminMainLayout>
  );
};

export default AddQuestion;
