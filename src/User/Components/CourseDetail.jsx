import { List, Card, Button, Typography, Divider } from "antd";
import UserMainLayout from "../Components/UserMainLayout";
import { useParams, useNavigate } from "react-router-dom";

const { Title } = Typography;

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Sample data - replace with API call to fetch course details
  const course = {
    id: id,
    name: "Mathematics 101",
    description: "Basic mathematics course covering algebra and geometry",
    questionPapers: [
      {
        id: "qp1",
        title: "Algebra Basics - Test 1",
        duration: 60, // minutes
        totalQuestions: 20,
      },
      {
        id: "qp2",
        title: "Geometry Fundamentals - Test 1",
        duration: 45,
        totalQuestions: 15,
      },
    ],
  };

  return (
    <UserMainLayout>
      <Card title={course.name}>
        <p>{course.description}</p>

        <Divider orientation="left">Question Papers</Divider>

        <List
          itemLayout="horizontal"
          dataSource={course.questionPapers}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button
                  type="primary"
                  onClick={() => navigate(`/test/${item.id}`)}
                >
                  Take Test
                </Button>,
              ]}
            >
              <List.Item.Meta
                title={item.title}
                description={`Duration: ${item.duration} mins | Questions: ${item.totalQuestions}`}
              />
            </List.Item>
          )}
        />
      </Card>
    </UserMainLayout>
  );
};

export default CourseDetail;
