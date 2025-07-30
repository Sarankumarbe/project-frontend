import React, { useState, useEffect } from "react";
import AdminMainLayout from "../Components/AdminMainLayout";
import {
  useGetPaymentsQuery,
  useGetPaymentStatsQuery,
} from "../../store/api/adminApi";
import {
  Table,
  Card,
  Input,
  Select,
  Button,
  Spin,
  Statistic,
  Row,
  Col,
  Tag,
  Space,
  DatePicker,
  Pagination,
  Alert,
  Divider,
} from "antd";
import {
  SearchOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import moment from "moment";

const { Option } = Select;

const AdminPayments = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [limit, setLimit] = useState(10);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch payments with current filters
  const {
    data: paymentsData,
    isLoading: paymentsLoading,
    error: paymentsError,
    refetch: refetchPayments,
  } = useGetPaymentsQuery({
    page: currentPage,
    limit,
    search: debouncedSearchTerm,
    status: statusFilter,
    sortBy,
    sortOrder,
  });

  // Fetch payment statistics
  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
  } = useGetPaymentStatsQuery();

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
    setCurrentPage(1);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount || 0);
  };

  const columns = [
    {
      title: (
        <span onClick={() => handleSortChange("createdAt")}>
          Date{" "}
          {sortBy === "createdAt" &&
            (sortOrder === "asc" ? <ArrowUpOutlined /> : <ArrowDownOutlined />)}
        </span>
      ),
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => moment(date).format("DD MMM YYYY, hh:mm A"),
      sorter: true,
    },
    {
      title: "User",
      key: "user",
      render: (_, payment) => (
        <div>
          <div>
            {`${payment.user?.firstName || ""} ${
              payment.user?.lastName || ""
            }`.trim() || "N/A"}
          </div>
          <div style={{ fontSize: "12px", color: "#888" }}>
            {payment.user?.email || "N/A"}
          </div>
        </div>
      ),
    },
    {
      title: "Course",
      dataIndex: ["course", "title"],
      key: "course",
      render: (title) => title || "N/A",
    },
    {
      title: "Payment ID",
      key: "paymentId",
      render: (_, payment) => (
        <div>
          <div>{payment.razorpayPaymentId || "N/A"}</div>
          <div style={{ fontSize: "12px", color: "#888" }}>
            Order: {payment.razorpayOrderId || "N/A"}
          </div>
        </div>
      ),
    },
    {
      title: (
        <span onClick={() => handleSortChange("isPaid")}>
          Status{" "}
          {sortBy === "isPaid" &&
            (sortOrder === "asc" ? <ArrowUpOutlined /> : <ArrowDownOutlined />)}
        </span>
      ),
      key: "status",
      render: (_, payment) => (
        <Space direction="vertical" size="small">
          <Tag color={payment.isPaid ? "green" : "orange"}>
            {payment.isPaid ? "Paid" : "Pending"}
          </Tag>
          {payment.isPaid && payment.paidAt && (
            <div style={{ fontSize: "12px", color: "#888" }}>
              {moment(payment.paidAt).format("DD MMM YYYY, hh:mm A")}
            </div>
          )}
        </Space>
      ),
    },
    {
      title: "Amount",
      dataIndex: ["course", "price"],
      key: "amount",
      render: (price) => formatCurrency(price),
    },
  ];

  return (
    <AdminMainLayout>
      <div style={{ padding: 24 }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 8 }}>
            Payment Management
          </h1>
          <p style={{ color: "#666" }}>
            Manage and monitor all payment transactions
          </p>
        </div>

        {/* Payment Statistics */}
        {!statsLoading && stats && (
          <Row gutter={16} style={{ marginBottom: 24 }}>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Total Payments"
                  value={stats.totalPayments}
                  valueStyle={{ color: "#333" }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Paid"
                  value={stats.paidPayments}
                  valueStyle={{ color: "#52c41a" }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Pending"
                  value={stats.pendingPayments}
                  valueStyle={{ color: "#faad14" }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Total Revenue"
                  value={stats.totalRevenue}
                  precision={2}
                  valueStyle={{ color: "#1890ff" }}
                  prefix="₹"
                />
              </Card>
            </Col>
          </Row>
        )}

        {/* Filters and Search */}
        <Card style={{ marginBottom: 24 }}>
          <Row gutter={16}>
            <Col xs={24} sm={12} md={6} lg={6}>
              <Input
                placeholder="Search by user, course, or payment ID..."
                prefix={<SearchOutlined />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                allowClear
              />
            </Col>
            <Col xs={24} sm={12} md={6} lg={6}>
              <Select
                style={{ width: "100%" }}
                value={statusFilter}
                onChange={(value) => {
                  setStatusFilter(value);
                  setCurrentPage(1);
                }}
                allowClear
                placeholder="All Status"
              >
                <Option value="paid">Paid</Option>
                <Option value="pending">Pending</Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={6} lg={6}>
              <Select
                style={{ width: "100%" }}
                value={sortBy}
                onChange={(value) => {
                  setSortBy(value);
                  setCurrentPage(1);
                }}
                placeholder="Sort By"
              >
                <Option value="createdAt">Date Created</Option>
                <Option value="paidAt">Payment Date</Option>
                <Option value="isPaid">Status</Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={6} lg={6}>
              <Select
                style={{ width: "100%" }}
                value={limit}
                onChange={(value) => {
                  setLimit(value);
                  setCurrentPage(1);
                }}
                placeholder="Items per page"
              >
                <Option value={5}>5 per page</Option>
                <Option value={10}>10 per page</Option>
                <Option value={25}>25 per page</Option>
                <Option value={50}>50 per page</Option>
              </Select>
            </Col>
          </Row>
        </Card>

        {/* Payments Table */}
        <Card>
          {paymentsLoading ? (
            <div style={{ textAlign: "center", padding: 40 }}>
              <Spin size="large" />
              <p style={{ marginTop: 16, color: "#666" }}>
                Loading payments...
              </p>
            </div>
          ) : paymentsError ? (
            <div style={{ textAlign: "center", padding: 24 }}>
              <Alert
                message="Error loading payments"
                description="Please try again"
                type="error"
                showIcon
              />
              <Button
                onClick={refetchPayments}
                icon={<ReloadOutlined />}
                type="primary"
                style={{ marginTop: 16 }}
              >
                Retry
              </Button>
            </div>
          ) : (
            <>
              <Table
                columns={columns}
                dataSource={paymentsData?.payments || []}
                rowKey="_id"
                pagination={false}
                loading={paymentsLoading}
                scroll={{ x: true }}
              />
              {paymentsData?.payments?.length === 0 && (
                <div style={{ textAlign: "center", padding: 24 }}>
                  <p style={{ color: "#666" }}>
                    No payments found matching your criteria.
                  </p>
                </div>
              )}
              <div style={{ marginTop: 24, textAlign: "right" }}>
                <Pagination
                  current={currentPage}
                  total={paymentsData?.pagination?.totalPayments || 0}
                  pageSize={limit}
                  onChange={handlePageChange}
                  showSizeChanger={false}
                  showTotal={(total, range) =>
                    `${range[0]}-${range[1]} of ${total} items`
                  }
                />
              </div>
            </>
          )}
        </Card>
      </div>
    </AdminMainLayout>
  );
};

export default AdminPayments;
