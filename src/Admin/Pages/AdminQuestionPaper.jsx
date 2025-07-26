import AdminMainLayout from "../Components/AdminMainLayout";
import { Button, Table, Space, Tag, Modal, message } from "antd";
import { useNavigate } from "react-router-dom";
import {
  useGetQuestionPapersQuery,
  useDeleteQuestionPaperMutation,
} from "../../store/api/adminApi";
import dayjs from "dayjs";
import { ExclamationCircleFilled } from "@ant-design/icons";

const { confirm } = Modal;

const AdminQuestionPaper = () => {
  const navigate = useNavigate();
  const { data: questionPapers = [], isLoading } = useGetQuestionPapersQuery();
  const [deleteQuestionPaper] = useDeleteQuestionPaperMutation();

  const handleDelete = (id) => {
    confirm({
      title: "Are you sure you want to delete this question paper?",
      icon: <ExclamationCircleFilled />,
      content: "This action cannot be undone.",
      okText: "Yes, delete it",
      okType: "danger",
      cancelText: "No, cancel",
      onOk() {
        return deleteQuestionPaper(id)
          .unwrap()
          .then(() => {
            message.success("Question paper deleted successfully");
          })
          .catch(() => {
            message.error("Failed to delete question paper");
          });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: "Duration (mins)",
      dataIndex: "duration",
      key: "duration",
      align: "center",
    },
    {
      title: "Total Questions",
      dataIndex: "questions",
      key: "totalQuestions",
      render: (questions) => questions.length,
      align: "center",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => dayjs(date).format("DD MMM YYYY, hh:mm A"),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            onClick={() => navigate(`/admin/question-papers/${record._id}`)}
          >
            View
          </Button>
          <Button
            onClick={() => navigate(`/admin/edit-question-paper/${record._id}`)}
          >
            Edit
          </Button>
          <Button danger onClick={() => handleDelete(record._id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <AdminMainLayout>
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <h2>Question Papers</h2>
        <Button
          type="primary"
          onClick={() => navigate("/admin/add-question-paper")}
        >
          Add Question Paper
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={questionPapers}
        rowKey="_id"
        loading={isLoading}
        bordered
        pagination={{
          pageSize: 10,
          showSizeChanger: false,
        }}
      />
    </AdminMainLayout>
  );
};

export default AdminQuestionPaper;
