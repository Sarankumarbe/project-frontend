import React, { useState } from "react";
import {
  Table,
  Button,
  Input,
  Space,
  Modal,
  Tag,
  message,
  Pagination,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  CloseOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import moment from "moment";
import AdminMainLayout from "../Components/AdminMainLayout";
import CouponForm from "../Components/CouponForm";
import ViewCouponModal from "../Components/ViewCouponModal";

const AdminCoupons = () => {
  const [formVisible, setFormVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [deactivateModalVisible, setDeactivateModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [actionCoupon, setActionCoupon] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Mock data - replace with API calls later
  const [coupons, setCoupons] = useState([
    {
      id: "1",
      title: "Summer Sale",
      code: "SUMMER20",
      type: "percentage",
      value: 20,
      minAmount: 1000,
      expiryDate: moment().add(30, "days").toISOString(),
      active: true,
      createdAt: moment().subtract(10, "days").toISOString(),
    },
    {
      id: "2",
      title: "Flat Discount",
      code: "FLAT100",
      type: "flat",
      value: 100,
      minAmount: 500,
      expiryDate: moment().add(15, "days").toISOString(),
      active: false,
      createdAt: moment().subtract(5, "days").toISOString(),
    },
  ]);

  const filteredCoupons = coupons.filter(
    (coupon) =>
      coupon.title.toLowerCase().includes(searchText.toLowerCase()) ||
      coupon.code.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleAddCoupon = () => {
    setSelectedCoupon(null);
    setFormVisible(true);
  };

  const handleEditCoupon = (coupon) => {
    setSelectedCoupon(coupon);
    setFormVisible(true);
  };

  const handleViewCoupon = (coupon) => {
    setSelectedCoupon(coupon);
    setViewModalVisible(true);
  };

  const showDeactivateModal = (coupon) => {
    setActionCoupon(coupon);
    setDeactivateModalVisible(true);
  };

  const showDeleteModal = (coupon) => {
    setActionCoupon(coupon);
    setDeleteModalVisible(true);
  };

  const handleDeactivate = () => {
    setCoupons(
      coupons.map((coupon) =>
        coupon.id === actionCoupon.id
          ? { ...coupon, active: !coupon.active }
          : coupon
      )
    );
    message.success(
      `Coupon ${actionCoupon.active ? "deactivated" : "activated"} successfully`
    );
    setDeactivateModalVisible(false);
  };

  const handleDelete = () => {
    setCoupons(coupons.filter((coupon) => coupon.id !== actionCoupon.id));
    message.success("Coupon deleted successfully");
    setDeleteModalVisible(false);
  };

  const handleFormSubmit = (values) => {
    if (selectedCoupon) {
      // Edit existing coupon
      setCoupons(
        coupons.map((coupon) =>
          coupon.id === selectedCoupon.id
            ? {
                ...coupon,
                ...values,
                expiryDate: values.expiryDate.toISOString(),
              }
            : coupon
        )
      );
      message.success("Coupon updated successfully");
    } else {
      // Add new coupon
      const newCoupon = {
        ...values,
        id: Math.random().toString(36).substr(2, 9),
        active: true,
        createdAt: new Date().toISOString(),
        expiryDate: values.expiryDate.toISOString(),
      };
      setCoupons([...coupons, newCoupon]);
      message.success("Coupon created successfully");
    }
    setFormVisible(false);
  };

  const columns = [
    {
      title: "Coupon Code",
      dataIndex: "code",
      key: "code",
      render: (text, record) => (
        <span style={{ fontWeight: "bold" }}>{text}</span>
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Discount",
      dataIndex: "value",
      key: "value",
      render: (text, record) =>
        record.type === "percentage" ? `${text}%` : `₹${text}`,
    },
    {
      title: "Min. Amount",
      dataIndex: "minAmount",
      key: "minAmount",
      render: (text) => `₹${text}`,
    },
    {
      title: "Expiry Date",
      dataIndex: "expiryDate",
      key: "expiryDate",
      render: (text) => moment(text).format("DD/MM/YYYY"),
    },
    {
      title: "Status",
      dataIndex: "active",
      key: "active",
      render: (active) => (
        <Tag color={active ? "green" : "red"}>
          {active ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button
            icon={<EyeOutlined />}
            onClick={() => handleViewCoupon(record)}
          />
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEditCoupon(record)}
          />
          <Button
            icon={record.active ? <CloseOutlined /> : <CheckOutlined />}
            danger={record.active}
            onClick={() => showDeactivateModal(record)}
          />
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => showDeleteModal(record)}
          />
        </Space>
      ),
    },
  ];

  return (
    <AdminMainLayout>
      <div style={{ marginBottom: 16 }}>
        <Space>
          <Input
            placeholder="Search coupons"
            prefix={<SearchOutlined />}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddCoupon}
          >
            Add Coupon
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={filteredCoupons}
        rowKey="id"
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: filteredCoupons.length,
          onChange: (page, pageSize) => {
            setCurrentPage(page);
            setPageSize(pageSize);
          },
          showSizeChanger: true,
        }}
      />

      <CouponForm
        visible={formVisible}
        onCancel={() => setFormVisible(false)}
        onSubmit={handleFormSubmit}
        initialValues={selectedCoupon}
        isEdit={!!selectedCoupon}
      />

      <ViewCouponModal
        visible={viewModalVisible}
        coupon={selectedCoupon}
        onCancel={() => setViewModalVisible(false)}
      />

      {/* Deactivate/Activate Confirmation Modal */}
      <Modal
        title={actionCoupon?.active ? "Deactivate Coupon" : "Activate Coupon"}
        visible={deactivateModalVisible}
        onOk={handleDeactivate}
        onCancel={() => setDeactivateModalVisible(false)}
        okText={actionCoupon?.active ? "Deactivate" : "Activate"}
        cancelText="Cancel"
      >
        <p>
          Are you sure you want to{" "}
          {actionCoupon?.active ? "deactivate" : "activate"} the coupon
          <strong> {actionCoupon?.code}</strong>?
        </p>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Delete Coupon"
        visible={deleteModalVisible}
        onOk={handleDelete}
        onCancel={() => setDeleteModalVisible(false)}
        okText="Delete"
        okButtonProps={{ danger: true }}
        cancelText="Cancel"
      >
        <p>
          Are you sure you want to delete the coupon
          <strong> {actionCoupon?.code}</strong>? This action cannot be undone.
        </p>
      </Modal>
    </AdminMainLayout>
  );
};

export default AdminCoupons;
