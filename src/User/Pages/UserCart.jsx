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
  Modal,
  Descriptions,
} from "antd";
import {
  DeleteOutlined,
  ShoppingCartOutlined,
  ArrowLeftOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetAllCoursesQuery,
  useGetCartItemsQuery,
  useAddToCartMutation,
  useRemoveFromCartMutation,
  useCreateOrderMutation,
  useVerifyPaymentMutation,
} from "../../store/api/userApi";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../store/slices/authSlice";

const { Title, Text, Paragraph } = Typography;

const UserCart = () => {
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  const userId = user?._id;

  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  // RTK Query hooks
  const { data: allCoursesData, isLoading: isCoursesLoading } =
    useGetAllCoursesQuery();
  const {
    data: cartData,
    isLoading: isCartLoading,
    refetch: refetchCart,
  } = useGetCartItemsQuery(userId, {
    skip: !userId,
  });
  const [addToCart] = useAddToCartMutation();
  const [removeFromCart] = useRemoveFromCartMutation();
  const [createOrder] = useCreateOrderMutation();
  const [verifyPayment] = useVerifyPaymentMutation();

  const allCourses = allCoursesData?.courses || [];
  const cartItems =
    cartData?.map((item) => ({
      ...item.courseId,
      _id: item.courseId._id,
      addedAt: item.addedAt,
    })) || [];

  // Load Razorpay script with better error handling
  const loadRazorpay = () => {
    return new Promise((resolve, reject) => {
      // Check if already loaded
      if (window.Razorpay) {
        setRazorpayLoaded(true);
        resolve(true);
        return;
      }

      // Remove existing script if any
      const existingScript = document.querySelector('script[src*="razorpay"]');
      if (existingScript) {
        existingScript.remove();
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;

      script.onload = () => {
        console.log("Razorpay script loaded successfully");
        setRazorpayLoaded(true);
        resolve(true);
      };

      script.onerror = (error) => {
        console.error("Failed to load Razorpay script:", error);
        setRazorpayLoaded(false);
        reject(new Error("Failed to load Razorpay script"));
      };

      document.head.appendChild(script);
    });
  };

  // Load Razorpay on component mount
  useEffect(() => {
    loadRazorpay().catch((error) => {
      console.error("Error loading Razorpay:", error);
    });
  }, []);

  const handleRemoveItem = async (courseId) => {
    try {
      await removeFromCart({ userId, courseId }).unwrap();
      message.success("Course removed from cart");
      refetchCart();
    } catch (err) {
      message.error(err.data?.message || "Failed to remove from cart");
    }
  };

  const handleAddToCart = async (course) => {
    if (!userId) {
      message.error("User not identified. Please try again.");
      return;
    }

    try {
      await addToCart({ userId, courseId: course._id }).unwrap();
      message.success("Course added to cart");
      refetchCart();
    } catch (err) {
      message.error(err.data?.message || "Failed to add to cart");
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      message.warning("Your cart is empty");
      return;
    }
    setIsPaymentModalVisible(true);
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price, 0);
  };

  const initiatePayment = async () => {
    if (!userId || cartItems.length === 0) {
      message.error("Invalid user or empty cart");
      return;
    }

    setOrderLoading(true);

    try {
      // Ensure Razorpay is loaded
      if (!razorpayLoaded || !window.Razorpay) {
        console.log("Razorpay not loaded, attempting to load...");
        await loadRazorpay();

        // Wait a bit for the script to be ready
        await new Promise((resolve) => setTimeout(resolve, 500));

        if (!window.Razorpay) {
          throw new Error(
            "Razorpay failed to load. Please refresh and try again."
          );
        }
      }

      console.log("Creating order...");

      // Create order on backend
      const orderResponse = await createOrder({
        userId,
        courses: cartItems.map((item) => item._id),
        amount: calculateTotal(),
      }).unwrap();

      console.log("Order response:", orderResponse);

      if (!orderResponse.order || !orderResponse.order.id) {
        throw new Error("Invalid order response from server");
      }

      // Get Razorpay key for Vite:
      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;

      if (!razorpayKey) {
        throw new Error("Razorpay key not configured. Please contact support.");
      }

      console.log("Initializing Razorpay with key:", razorpayKey);

      // Initialize Razorpay options
      const options = {
        key: razorpayKey,
        amount: orderResponse.order.amount,
        currency: "INR",
        name: "Your Company Name",
        description: "Course Purchase",
        order_id: orderResponse.order.id,
        handler: async function (response) {
          console.log("Payment successful, response:", response);

          try {
            // Verify payment on backend
            const verificationResponse = await verifyPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              userId: userId,
            }).unwrap();

            if (verificationResponse.success) {
              // Remove all cart items locally (optimistic update)
              const cartItemIds = cartItems.map((item) => item._id);
              await Promise.all(
                cartItemIds.map((courseId) =>
                  removeFromCart({ userId, courseId }).unwrap()
                )
              );

              message.success(
                "Payment successful! Courses have been added to your account."
              );
              refetchCart(); // Refresh to confirm
              setIsPaymentModalVisible(false);
              navigate("/user-course");
            } else {
              message.error("Payment verification failed");
            }
          } catch (err) {
            console.error("Payment verification error:", err);
            message.error(err.data?.message || "Payment verification failed");
          } finally {
            setOrderLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            console.log("Payment modal dismissed");
            setOrderLoading(false);
          },
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
          contact: user?.phone || "",
        },
        theme: {
          color: "#1890ff",
        },
        retry: {
          enabled: true,
          max_count: 3,
        },
      };

      console.log("Creating Razorpay instance with options:", options);

      // Create and open Razorpay
      const rzp = new window.Razorpay(options);

      // Add error handler for Razorpay
      rzp.on("payment.failed", function (response) {
        console.error("Payment failed:", response.error);
        message.error(`Payment failed: ${response.error.description}`);
        setOrderLoading(false);
      });

      console.log("Opening Razorpay modal...");
      rzp.open();

      // Close the confirmation modal
      setIsPaymentModalVisible(false);
    } catch (err) {
      console.error("Payment initiation error:", err);
      message.error(
        err.message || err.data?.message || "Failed to initiate payment"
      );
      setOrderLoading(false);
      setIsPaymentModalVisible(false);
    }
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

  // Filter out courses that are already in cart
  const availableCourses = allCourses.filter(
    (course) => !cartItems.some((item) => item._id === course._id)
  );

  const loading = isCoursesLoading || isCartLoading;

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

        <Modal
          title="Confirm Purchase"
          open={isPaymentModalVisible}
          onOk={initiatePayment}
          onCancel={() => setIsPaymentModalVisible(false)}
          okText={orderLoading ? <Spin size="small" /> : "Confirm & Pay"}
          cancelText="Cancel"
          confirmLoading={orderLoading}
          width={700}
        >
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Courses">
              {cartItems.map((item) => (
                <div key={item._id} style={{ marginBottom: 8 }}>
                  <Text strong>{item.title}</Text> - ₹{item.price}
                </div>
              ))}
            </Descriptions.Item>
            <Descriptions.Item label="Total Amount">
              <Text strong>₹{calculateTotal()}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Payment Method">
              <Text>Razorpay (Credit/Debit Card, UPI, Net Banking)</Text>
            </Descriptions.Item>
          </Descriptions>
          <div style={{ marginTop: 16 }}>
            <Text type="secondary">
              By clicking "Confirm & Pay", you will be redirected to Razorpay's
              secure payment gateway to complete your purchase.
            </Text>
          </div>
        </Modal>
      </div>
    </UserMainLayout>
  );
};

export default UserCart;
