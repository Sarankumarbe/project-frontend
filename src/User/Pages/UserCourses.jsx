import { Table, Button, Card, message, Image, Tag } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import UserMainLayout from "../Components/UserMainLayout";
import { useNavigate } from "react-router-dom";
import {
  useGetUserCoursesQuery,
  useGetPurchasedCourseDetailsQuery,
} from "../../store/api/userApi";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../store/slices/authSlice";
import { useEffect } from "react";

const UserCourses = () => {
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  const {
    data: coursesData,
    isLoading,
    isError,
    error,
  } = useGetUserCoursesQuery(user?._id);
  const { data: courseDetails, trigger } = useGetPurchasedCourseDetailsQuery();

  useEffect(() => {
    if (isError) {
      message.error(error?.data?.error || "Failed to load courses");
    }
  }, [isError, error]);

  const handleViewCourse = (courseId) => {
    navigate(`/user-course/${courseId}`);
  };

  const columns = [
    {
      title: "Course",
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          {record.image ? (
            <Image
              src={`/${record.image}`}
              alt={record.title}
              width={80}
              height={60}
              style={{ objectFit: "cover", marginRight: 16 }}
              preview={false}
            />
          ) : (
            <div
              style={{
                width: 80,
                height: 60,
                background: "#f0f0f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 16,
              }}
            >
              <Tag color="blue">No Image</Tag>
            </div>
          )}
          <div>
            <div style={{ fontWeight: "bold" }}>{record.title}</div>
            <div style={{ color: "#666" }}>{record.description}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Purchased On",
      dataIndex: "purchaseDate",
      key: "purchaseDate",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Papers",
      dataIndex: "questionPapers",
      key: "questionPapers",
      render: (papers) => papers?.length || 0,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => handleViewCourse(record._id)}
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
          dataSource={coursesData?.courses || []}
          columns={columns}
          rowKey="_id"
          pagination={false}
          loading={isLoading}
        />
      </Card>
    </UserMainLayout>
  );
};

export default UserCourses;
