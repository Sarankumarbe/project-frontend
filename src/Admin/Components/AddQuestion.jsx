import { useState } from "react";
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
  FileTextOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import AdminMainLayout from "../Components/AdminMainLayout";
import {
  useUploadQuestionPaperMutation,
  useSaveQuestionsMutation,
} from "../../store/api/adminApi";

const { Option } = Select;
const { TextArea } = Input;
const { Title, Text } = Typography;
const { Panel } = Collapse;

const AddQuestion = () => {
  const [form] = Form.useForm();
  const [uploadQuestionPaper] = useUploadQuestionPaperMutation();
  const [saveQuestions] = useSaveQuestionsMutation();
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
  const [submitModalVisible, setSubmitModalVisible] = useState(false);
  const [paperMetadata, setPaperMetadata] = useState({
    title: "",
    duration: 60, // default 60 minutes
  });

  const handleFileUpload = async (file) => {
    setIsLoading(true);
    setParsedQuestions([]);
    setActiveQuestionIndex(0);
    form.resetFields();

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await uploadQuestionPaper(formData).unwrap();

      if (response.questions?.length > 0) {
        setParsedQuestions(response.questions);
        setActiveQuestionIndex(0);
        form.setFieldsValue(response.questions[0]);
        message.success(
          `Successfully parsed ${response.questions.length} questions!`,
          5
        );
      } else {
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
      }
    } catch (error) {
      console.error("Error processing file:", error);
      message.error(
        `Error processing file: ${
          error.message || error.data?.message || "Unknown error"
        }`
      );
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
  };

  const removeImage = (fieldType, optionKey = null) => {
    const updatedQuestions = [...parsedQuestions];
    const currentQuestion = updatedQuestions[activeQuestionIndex];

    if (fieldType === "question") {
      currentQuestion.questionImage = null;
    } else if (fieldType === "option" && optionKey) {
      currentQuestion.options[optionKey].image = null;
    }

    currentQuestion.hasImages = Boolean(
      currentQuestion.questionImage ||
        Object.values(currentQuestion.options).some((opt) => opt?.image)
    );
    currentQuestion.isEdited = true;

    setParsedQuestions(updatedQuestions);
    form.setFieldsValue(currentQuestion);
    message.success("Image removed successfully!");
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

  // In AddQuestion.jsx, replace the submitAllQuestions function with this:

  const submitAllQuestions = async () => {
    if (parsedQuestions.length === 0) {
      message.warning("No questions to submit!");
      return;
    }

    try {
      // First, save the current question being edited
      const currentFormValues = await form.validateFields();
      const updatedQuestions = [...parsedQuestions];
      updatedQuestions[activeQuestionIndex] = {
        ...updatedQuestions[activeQuestionIndex],
        ...currentFormValues,
        isEdited: true,
      };
      setParsedQuestions(updatedQuestions);

      // Then show the submit modal
      setSubmitModalVisible(true);
    } catch (error) {
      // If validation fails, still show the modal but warn user
      console.warn("Current question has validation errors:", error);
      setSubmitModalVisible(true);
    }
  };

  const filteredQuestions = parsedQuestions.filter((q) => {
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
              />
            )}
          </Space>
        </Card>
        {parsedQuestions.length > 0 && (
          <Row gutter={16}>
            <Col span={8}>
              <Card
                title={`Questions (${parsedQuestions.length})`}
                extra={
                  <Space>
                    <Input.Search
                      placeholder="Search questions..."
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      style={{ width: 20 }}
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
                <div style={{ maxHeight: "250vh", overflowY: "auto" }}>
                  {filteredQuestions.map((q, index) => (
                    <div
                      key={q.id}
                      onClick={() => handleQuestionSelect(index)}
                      style={{
                        padding: "12px",
                        marginBottom: 8,
                        cursor: "pointer",
                        backgroundColor:
                          activeQuestionIndex === index
                            ? "#e6f7ff"
                            : "transparent",
                        borderRadius: 8,
                        border:
                          activeQuestionIndex === index
                            ? "2px solid #1890ff"
                            : "1px solid #f0f0f0",
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
                            {saveStatus[index] && (
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
                              deleteQuestion(index);
                            }}
                          />
                        </Space>
                        <Text
                          ellipsis={{ tooltip: q.questionText }}
                          style={{ fontSize: 14 }}
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
                  ))}
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
                      <Form.Item name="questionText" label="Question Text">
                        <TextArea
                          rows={4}
                          placeholder="Enter the question text here..."
                          style={{ whiteSpace: "pre-line" }}
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
                          >
                            <Select placeholder="Select correct answer">
                              {["A", "B", "C", "D", "E"].map((opt) => (
                                <Option key={opt} value={opt}>
                                  {opt}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item name="difficulty" label="Difficulty Level">
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
                          <Form.Item name="marks" label="Marks">
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
                  <div style={{ whiteSpace: "pre-line" }}>
                    {parsedQuestions[activeQuestionIndex].questionText}
                  </div>
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
                    <div style={{ whiteSpace: "pre-line" }}>
                      {
                        parsedQuestions[activeQuestionIndex].options[option]
                          ?.text
                      }
                    </div>
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
                    <div style={{ whiteSpace: "pre-line" }}>
                      {parsedQuestions[activeQuestionIndex].explanation}
                    </div>
                  </Descriptions.Item>
                )}
              </Descriptions>
            </div>
          )}
        </Modal>
        <Modal
          title="Submit Question Paper"
          visible={submitModalVisible}
          onCancel={() => setSubmitModalVisible(false)}
          // In AddQuestion.jsx, replace the Modal onOk handler with this:

          onOk={async () => {
            if (parsedQuestions.length === 0) {
              message.error("No questions to submit.");
              return;
            }

            // Get the latest questions state (including any unsaved changes)
            let questionsToSubmit = [...parsedQuestions];

            try {
              // Try to save current form values if form is valid
              const currentFormValues = await form.validateFields();
              questionsToSubmit[activeQuestionIndex] = {
                ...questionsToSubmit[activeQuestionIndex],
                ...currentFormValues,
                isEdited: true,
              };
            } catch (formError) {
              console.warn(
                "Using existing question data due to form validation error"
              );
            }

            // Validate all questions before submitting
            const invalidQuestions = questionsToSubmit.filter((q, idx) => {
              if (!q.questionText?.trim()) return true;
              if (
                !q.correctAnswer ||
                !["A", "B", "C", "D", "E"].includes(q.correctAnswer)
              )
                return true;

              // Check if all options have text
              const optionsValid = ["A", "B", "C", "D", "E"].every((opt) =>
                q.options?.[opt]?.text?.trim()
              );
              if (!optionsValid) return true;

              return false;
            });

            if (invalidQuestions.length > 0) {
              message.error(
                `Cannot submit. ${invalidQuestions.length} question(s) are invalid. Please check all questions have text, options, and correct answers.`
              );
              return;
            }

            try {
              setIsLoading(true);

              const payload = {
                title:
                  paperMetadata.title ||
                  `Paper ${new Date().toLocaleDateString()}`,
                duration: paperMetadata.duration || 60,
                questions: questionsToSubmit,
              };

              console.log("Submitting payload:", payload); // Debug log

              const response = await saveQuestions(payload).unwrap();

              message.success(
                `Successfully saved paper with ${response.questionPaper.questions.length} questions!`
              );

              // Reset state after successful submission
              setParsedQuestions([]);
              setActiveQuestionIndex(0);
              form.resetFields();
              setSaveStatus({});
              setPaperMetadata({ title: "", duration: 60 });
              setSubmitModalVisible(false);
            } catch (error) {
              console.error("Failed to submit questions:", error);
              message.error(
                error.data?.message ||
                  error.message ||
                  "Failed to save questions"
              );
            } finally {
              setIsLoading(false);
            }
          }}
        >
          <Input
            placeholder="Question Paper Title"
            value={paperMetadata.title}
            onChange={(e) =>
              setPaperMetadata({ ...paperMetadata, title: e.target.value })
            }
            style={{ marginBottom: "10px" }}
          />
          <InputNumber
            placeholder="Duration (minutes)"
            value={paperMetadata.duration}
            onChange={(value) =>
              setPaperMetadata({ ...paperMetadata, duration: value })
            }
            style={{ width: "100%" }}
            min={1}
          />
        </Modal>
      </div>
    </AdminMainLayout>
  );
};

export default AddQuestion;
