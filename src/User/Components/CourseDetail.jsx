import React, { useEffect, useMemo } from "react";
import {
  List,
  Card,
  Button,
  Typography,
  Divider,
  Spin,
  message,
  Image,
} from "antd";
import UserMainLayout from "../Components/UserMainLayout";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetPurchasedCourseDetailsQuery,
  useGetSubmissionQuery,
} from "../../store/api/userApi";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../store/slices/authSlice";

const { Title, Text } = Typography;

const QuestionPaperItem = ({ questionPaper, userId, navigate }) => {
  const { data: submissionData, isLoading: submissionLoading } =
    useGetSubmissionQuery(
      // Only pass questionPaperId since that's what the API expects
      { questionPaperId: questionPaper._id },
      {
        skip: !userId || !questionPaper._id,
      }
    );

  const hasSubmission = submissionData?.isSubmitted || false;

  return (
    <List.Item
      actions={[
        hasSubmission ? (
          <Button
            type="default"
            onClick={() => navigate(`/submission/${questionPaper._id}`)}
          >
            View Submission
          </Button>
        ) : (
          <Button
            type="primary"
            onClick={() => navigate(`/test/${questionPaper._id}`)}
          >
            Take Test
          </Button>
        ),
      ]}
    >
      <List.Item.Meta
        title={questionPaper.title}
        description={
          <>
            <Text>Duration: {questionPaper.duration} mins</Text>
            <br />
            <Text>Total Questions: {questionPaper.questions?.length || 0}</Text>
            {hasSubmission && (
              <>
                <br />
                <Text type="success">Test Completed</Text>
              </>
            )}
          </>
        }
      />
    </List.Item>
  );
};

const CourseDetail = () => {
  const { id: courseId } = useParams();
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);

  const {
    data: courseData,
    isLoading,
    isError,
    error,
  } = useGetPurchasedCourseDetailsQuery({
    courseId,
    userId: user?._id,
  });

  useEffect(() => {
    if (isError) {
      message.error(error?.data?.error || "Failed to load course details");
    }
  }, [isError, error]);

  const course = courseData?.course;
  const questionPapers = course?.questionPapers || [];

  if (isLoading) {
    return (
      <UserMainLayout>
        <Card>
          <Spin size="large" />
        </Card>
      </UserMainLayout>
    );
  }

  if (isError) {
    return (
      <UserMainLayout>
        <Card>
          <Text type="danger">
            {error?.data?.error || "Failed to load course details"}
          </Text>
        </Card>
      </UserMainLayout>
    );
  }

  return (
    <UserMainLayout>
      <Card>
        <Title level={3}>Course Details</Title>

        {course && (
          <div style={{ marginBottom: 24 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              {course.image && (
                <Image
                  src={`/${course.image}`}
                  alt={course.title}
                  width={120}
                  height={90}
                  style={{ objectFit: "cover", marginRight: 16 }}
                  preview={false}
                />
              )}
              <div>
                <Title level={4}>{course.title}</Title>
                <Text>{course.description}</Text>
                <div>
                  <Text type="secondary">
                    Purchased on:{" "}
                    {new Date(course.purchaseDate).toLocaleDateString()}
                  </Text>
                </div>
              </div>
            </div>
          </div>
        )}

        <Divider orientation="left">Question Papers</Divider>

        {questionPapers.length === 0 ? (
          <Text type="secondary">
            No question papers available for this course
          </Text>
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={questionPapers}
            renderItem={(item) => (
              <QuestionPaperItem
                key={item._id}
                questionPaper={item}
                userId={user?._id}
                navigate={navigate}
              />
            )}
          />
        )}
      </Card>
    </UserMainLayout>
  );
};

export default CourseDetail;
