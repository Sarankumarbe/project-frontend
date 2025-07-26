import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetQuestionPaperQuery,
  useUpdateQuestionPaperMutation,
} from "../../store/api/adminApi";
import {
  Form,
  Input,
  InputNumber,
  Button,
  Card,
  Spin,
  message,
  Select,
  Space,
  Divider,
} from "antd";
import AdminMainLayout from "../Components/AdminMainLayout";

const { Option } = Select;

const EditQuestion = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const { data: questionPaper, isLoading } = useGetQuestionPaperQuery(id);
  const [updateQuestionPaper, { isLoading: isUpdating }] =
    useUpdateQuestionPaperMutation();

  const onFinish = async (values) => {
    try {
      await updateQuestionPaper({ id, ...values }).unwrap();
      message.success("Question paper updated successfully");
      navigate(-1);
    } catch (err) {
      message.error("Failed to update question paper");
    }
  };

  // Set form values when questionPaper is loaded
  React.useEffect(() => {
    if (questionPaper) {
      form.setFieldsValue({
        title: questionPaper.title,
        duration: questionPaper.duration,
        questions: questionPaper.questions,
      });
    }
  }, [questionPaper, form]);

  if (isLoading) return <Spin size="large" />;

  return (
    <AdminMainLayout>
      <div style={{ marginBottom: 16 }}>
        <Button onClick={() => navigate("/admin/question-paper")}>Back</Button>
      </div>
      <Card title="Edit Question Paper" bordered={false}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            title: questionPaper?.title || "",
            duration: questionPaper?.duration || 60,
            questions: questionPaper?.questions || [],
          }}
        >
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Please input the title!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Duration (minutes)"
            name="duration"
            rules={[{ required: true, message: "Please input the duration!" }]}
          >
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>

          <Divider orientation="left">Questions</Divider>

          <Form.List name="questions">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Card
                    key={key}
                    title={`Question ${name + 1}`}
                    style={{ marginBottom: 16 }}
                    extra={
                      <Button danger onClick={() => remove(name)}>
                        Remove
                      </Button>
                    }
                  >
                    <Form.Item
                      {...restField}
                      name={[name, "questionText"]}
                      label="Question Text"
                      rules={[
                        {
                          required: true,
                          message: "Question text is required",
                        },
                      ]}
                    >
                      <Input.TextArea rows={4} />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, "difficulty"]}
                      label="Difficulty"
                      rules={[{ required: true }]}
                    >
                      <Select>
                        <Option value="Easy">Easy</Option>
                        <Option value="Medium">Medium</Option>
                        <Option value="Hard">Hard</Option>
                      </Select>
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, "marks"]}
                      label="Marks"
                      rules={[{ required: true }]}
                    >
                      <InputNumber min={0} step={0.5} />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, "negativeMarks"]}
                      label="Negative Marks"
                      rules={[{ required: true }]}
                    >
                      <InputNumber min={0} step={0.25} />
                    </Form.Item>

                    <Divider orientation="left">Options</Divider>

                    <Form.Item
                      {...restField}
                      name={[name, "correctAnswer"]}
                      label="Correct Answer"
                      rules={[{ required: true }]}
                    >
                      <Select>
                        <Option value="A">A</Option>
                        <Option value="B">B</Option>
                        <Option value="C">C</Option>
                        <Option value="D">D</Option>
                        <Option value="E">E</Option>
                      </Select>
                    </Form.Item>

                    {["A", "B", "C", "D", "E"].map((option) => (
                      <Form.Item
                        key={option}
                        {...restField}
                        name={[name, "options", option, "text"]}
                        label={`Option ${option}`}
                        rules={[
                          {
                            required: true,
                            message: `Option ${option} is required`,
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                    ))}
                  </Card>
                ))}

                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block>
                    Add Question
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={isUpdating}>
                Save Changes
              </Button>
              <Button onClick={() => navigate(-1)}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </AdminMainLayout>
  );
};

export default EditQuestion;
