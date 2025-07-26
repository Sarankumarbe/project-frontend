import AdminMainLayout from "../Components/AdminMainLayout";
import { Button, Table, Space } from "antd";
import { useNavigate } from "react-router-dom";

const AdminQuestionPaper = () => {
  const navigate = useNavigate();

  // Mock data - replace with actual data from API later
  const questionPapers = [
    {
      id: 1,
      name: "Banking Exam Paper 1",
      subject: "Quantitative Aptitude",
      totalQuestions: 40,
      dateAdded: "2023-05-15",
    },
    {
      id: 2,
      name: "Reasoning Practice Paper",
      subject: "Logical Reasoning",
      totalQuestions: 40,
      dateAdded: "2023-05-10",
    },
  ];

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Subject",
      dataIndex: "subject",
      key: "subject",
    },
    {
      title: "Total Questions",
      dataIndex: "totalQuestions",
      key: "totalQuestions",
    },
    {
      title: "Date Added",
      dataIndex: "dateAdded",
      key: "dateAdded",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary">Edit</Button>
          <Button danger>Delete</Button>
        </Space>
      ),
    },
  ];

  return (
    <AdminMainLayout>
      <div style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          onClick={() => navigate("/admin/add-question-paper")}
        >
          Add Question Paper
        </Button>
      </div>
      <Table columns={columns} dataSource={questionPapers} rowKey="id" />
    </AdminMainLayout>
  );
};

export default AdminQuestionPaper;
