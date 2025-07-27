import UserMainLayout from "../Components/UserMainLayout";
import {
  Table,
  Button,
  Space,
  Typography,
  Card,
  Image,
  Tag,
  message,
  Popconfirm,
  Spin,
  Divider,
  Row,
  Col,
} from "antd";
import {
  DeleteOutlined,
  ShoppingCartOutlined,
  ArrowLeftOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetAllCoursesQuery } from "../../store/api/userApi";

const { Title, Text, Paragraph } = Typography;

const UserCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch all courses using RTK Query
  const { data: allCoursesData, isLoading: isCoursesLoading } =
    useGetAllCoursesQuery();
  const allCourses = allCoursesData?.courses || [];

  // Mock cart data - replace with actual API calls
  useEffect(() => {
    // Simulate API loading
    setTimeout(() => {
      setCartItems([
        {
          _id: "6885cdfbc5403fcb5c77eb3c",
          title: "Banking Questions",
          description: "Banking Questions for test",
          image: "uploads/course-images/image-1753599714315-393209192.jpeg",
          price: 10,
          questionPapers: [
            {
              _id: "688522dd7ee3ebfd79210bd9",
              title: "Banking Sample",
              duration: 120,
            },
          ],
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter out courses that are already in cart
  const availableCourses = allCourses.filter(
    (course) => !cartItems.some((item) => item._id === course._id)
  );

  const handleRemoveItem = (courseId) => {
    // Call your remove from cart API here
    setLoading(true);
    setTimeout(() => {
      setCartItems(cartItems.filter((item) => item._id !== courseId));
      message.success("Course removed from cart");
      setLoading(false);
    }, 500);
  };

  const handleAddToCart = (course) => {
    // Call your add to cart API here
    setLoading(true);
    setTimeout(() => {
      setCartItems([...cartItems, course]);
      message.success("Course added to cart");
      setLoading(false);
    }, 500);
  };

  const handleCheckout = () => {
    // Implement your checkout logic here
    message.success("Proceeding to checkout");
    navigate("/checkout");
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price, 0);
  };

  const cartColumns = [
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
              <Text type="secondary">No Image</Text>
            </div>
          )}
          <div>
            <Text strong>{record.title}</Text>
            <br />
            <Text type="secondary">{record.description}</Text>
          </div>
        </div>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => <Text strong>₹{price}</Text>,
      align: "center",
    },
    {
      title: "Papers",
      dataIndex: "questionPapers",
      key: "questionPapers",
      render: (papers) => <Text>{papers?.length || 0}</Text>,
      align: "center",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Popconfirm
          title="Remove this course from cart?"
          onConfirm={() => handleRemoveItem(record._id)}
          okText="Yes"
          cancelText="No"
        >
          <Button danger icon={<DeleteOutlined />}>
            Remove
          </Button>
        </Popconfirm>
      ),
      align: "center",
    },
  ];

  return (
    <UserMainLayout>
      <div style={{ padding: "24px" }}>
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/user-course")}
          style={{ marginBottom: 16 }}
        >
          Back
        </Button>

        <Title level={3} style={{ marginBottom: 24 }}>
          <ShoppingCartOutlined /> Your Cart
        </Title>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <Spin size="large" />
          </div>
        ) : cartItems.length === 0 ? (
          <Card>
            <div style={{ textAlign: "center", padding: "40px" }}>
              <ShoppingCartOutlined
                style={{ fontSize: "48px", color: "#ccc", marginBottom: 16 }}
              />
              <Title level={4}>Your cart is empty</Title>
              <Text type="secondary">Add courses to get started</Text>
            </div>
          </Card>
        ) : (
          <>
            <Table
              columns={cartColumns}
              dataSource={cartItems}
              rowKey="_id"
              pagination={false}
              scroll={{ x: true }}
            />

            <div style={{ marginTop: 24, textAlign: "right" }}>
              <Card>
                <Space size="large">
                  <Text strong style={{ fontSize: "18px" }}>
                    Total: ₹{calculateTotal()}
                  </Text>
                  <Button type="primary" size="large" onClick={handleCheckout}>
                    Proceed to Checkout
                  </Button>
                </Space>
              </Card>
            </div>
          </>
        )}

        {/* Available Courses Section */}
        <Divider />
        <Title level={4} style={{ marginBottom: 24 }}>
          Available Courses
        </Title>

        {isCoursesLoading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <Spin size="large" />
          </div>
        ) : availableCourses.length === 0 ? (
          <Card>
            <div style={{ textAlign: "center", padding: "40px" }}>
              <Text type="secondary">No additional courses available</Text>
            </div>
          </Card>
        ) : (
          <Row gutter={[16, 16]}>
            {availableCourses.map((course) => (
              <Col key={course._id} xs={24} sm={12} md={8} lg={6}>
                <Card
                  hoverable
                  cover={
                    course.image ? (
                      <Image
                        src={`/${course.image}`}
                        alt={course.title}
                        height={160}
                        style={{ objectFit: "cover" }}
                        preview={false}
                      />
                    ) : (
                      <div
                        style={{
                          height: 160,
                          background: "#1890ff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Title level={4} style={{ color: "#fff" }}>
                          {course.title.split(" ")[0]}
                        </Title>
                      </div>
                    )
                  }
                  actions={[
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={() => handleAddToCart(course)}
                      block
                    >
                      Add to Cart (₹{course.price})
                    </Button>,
                  ]}
                >
                  <Card.Meta
                    title={course.title}
                    description={
                      <>
                        <Paragraph ellipsis={{ rows: 2 }}>
                          {course.description}
                        </Paragraph>
                        <div style={{ marginTop: 8 }}>
                          <Text strong>Papers: </Text>
                          {course.questionPapers?.length || 0}
                        </div>
                        {course.questionPapers?.length > 0 && (
                          <div style={{ marginTop: 4 }}>
                            <Text strong>Duration: </Text>
                            {course.questionPapers[0].duration} mins
                          </div>
                        )}
                      </>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </UserMainLayout>
  );
};

export default UserCart;
