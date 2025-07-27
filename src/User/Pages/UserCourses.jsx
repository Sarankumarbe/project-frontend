import { Table, Button, Card } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import UserMainLayout from "../Components/UserMainLayout";
import { useNavigate } from "react-router-dom";

const UserCourses = () => {
  const navigate = useNavigate();

  // Sample data - replace with your actual data from API
  const courses = [
    {
      id: "1",
      name: "Mathematics 101",
      description: "Basic mathematics course",
      purchasedOn: "2023-05-15",
    },
    {
      id: "2",
      name: "Science Fundamentals",
      description: "Introduction to science",
      purchasedOn: "2023-06-20",
    },
  ];

  const columns = [
    {
      title: "Course Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Purchased On",
      dataIndex: "purchasedOn",
      key: "purchasedOn",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => navigate(`/user-course/${record.id}`)}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <UserMainLayout>
      <Card title="My Courses" bordered={false}>
        <Table
          dataSource={courses}
          columns={columns}
          rowKey="id"
          pagination={false}
        />
      </Card>
    </UserMainLayout>
  );
};

export default UserCourses;
