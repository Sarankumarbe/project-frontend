import { useParams } from "react-router-dom";
import { useGetQuestionPaperQuery } from "../../store/api/adminApi";
import { Card, Descriptions, Spin, message, Button } from "antd";
import AdminMainLayout from "../Components/AdminMainLayout";
import { useNavigate } from "react-router-dom";

const ViewQuestion = () => {
  const { id } = useParams();
  const {
    data: questionPaper,
    isLoading,
    isError,
  } = useGetQuestionPaperQuery(id);
  const navigate = useNavigate();

  if (isError) {
    message.error("Failed to load question paper");
    return null;
  }

  return (
    <AdminMainLayout>
      <div style={{ marginBottom: 16 }}>
        <Button onClick={() => navigate("/admin/question-paper")}>Back</Button>
      </div>

      <Spin spinning={isLoading}>
        <Card title={questionPaper?.title || "Question Paper"} bordered={false}>
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Title">
              {questionPaper?.title}
            </Descriptions.Item>
            <Descriptions.Item label="Duration">
              {questionPaper?.duration} minutes
            </Descriptions.Item>
            <Descriptions.Item label="Total Questions">
              {questionPaper?.questions?.length}
            </Descriptions.Item>
            <Descriptions.Item label="Created At">
              {new Date(questionPaper?.createdAt).toLocaleString()}
            </Descriptions.Item>
          </Descriptions>

          <div style={{ marginTop: 24 }}>
            <h3>Questions:</h3>
            {questionPaper?.questions?.map((question, index) => (
              <Card key={question._id} style={{ marginBottom: 16 }}>
                <p>
                  <strong>Q{index + 1}:</strong> {question.questionText}
                </p>
                <p>
                  <strong>Options:</strong>
                </p>
                <ul>
                  {Object.entries(question.options).map(([key, value]) => (
                    <li key={key}>
                      {key}: {value.text}{" "}
                      {question.correctAnswer === key && "(Correct Answer)"}
                    </li>
                  ))}
                </ul>
                <p>
                  <strong>Marks:</strong> {question.marks}
                </p>
                <p>
                  <strong>Negative Marks:</strong> {question.negativeMarks}
                </p>
                <p>
                  <strong>Difficulty:</strong> {question.difficulty}
                </p>
              </Card>
            ))}
          </div>
        </Card>
      </Spin>
    </AdminMainLayout>
  );
};

export default ViewQuestion;
