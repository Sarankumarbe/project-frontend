import React, { useState, useEffect } from "react";
import {
  Table,
  Input,
  Button,
  Space,
  Modal,
  message,
  Tag,
  Tooltip,
  Card,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  StopOutlined,
} from "@ant-design/icons";
import AdminMainLayout from "../Components/AdminMainLayout";
import AddEditUserModal from "../Components/AddEditUserModal";
import ViewUserModal from "../Components/ViewUserModal";

const { Search } = Input;

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Modal states
  const [addEditModalVisible, setAddEditModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [blockModalVisible, setBlockModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalMode, setModalMode] = useState("add"); // 'add' or 'edit'

  // Mock data for demonstration
  const mockUsers = [
    {
      id: 1,
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      role: "user",
      status: "active",
      createdAt: "2024-01-15",
    },
    {
      id: 2,
      firstName: "Jane",
      lastName: "Smith",
      email: "jane.smith@example.com",
      role: "user",
      status: "inactive",
      createdAt: "2024-01-20",
    },
    {
      id: 3,
      firstName: "Bob",
      lastName: "Johnson",
      email: "bob.johnson@example.com",
      role: "user",
      status: "inactive",
      createdAt: "2024-01-25",
    },
  ];

  useEffect(() => {
    fetchUsers();
  }, [pagination.current, pagination.pageSize, searchText]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await userAPI.getUsers({
      //   page: pagination.current,
      //   limit: pagination.pageSize,
      //   search: searchText,
      // });

      // Mock API response
      setTimeout(() => {
        const filteredUsers = mockUsers.filter(
          (user) =>
            user.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
            user.lastName.toLowerCase().includes(searchText.toLowerCase()) ||
            user.email.toLowerCase().includes(searchText.toLowerCase())
        );

        setUsers(filteredUsers);
        setPagination((prev) => ({
          ...prev,
          total: filteredUsers.length,
        }));
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error fetching users:", error);
      message.error("Failed to fetch users");
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleTableChange = (paginationConfig) => {
    setPagination({
      current: paginationConfig.current,
      pageSize: paginationConfig.pageSize,
      total: paginationConfig.total,
    });
  };

  const handleAddUser = () => {
    setModalMode("add");
    setSelectedUser(null);
    setAddEditModalVisible(true);
  };

  const handleEditUser = (user) => {
    setModalMode("edit");
    setSelectedUser(user);
    setAddEditModalVisible(true);
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setViewModalVisible(true);
  };

  const handleDeleteUser = async (userId) => {
    setDeleteModalVisible(false);
    try {
      // TODO: Replace with actual API call
      // await userAPI.deleteUser(userId);

      console.log("Deleting user:", userId);
      message.success("User deleted successfully");
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      message.error("Failed to delete user");
    }
  };

  const handleBlockUser = async (userId) => {
    setBlockModalVisible(false);
    try {
      // TODO: Replace with actual API call
      // await userAPI.updateUser(userId, { status: 'inactive' });

      console.log("Blocking user:", userId);
      message.success("User blocked successfully");
      fetchUsers();
    } catch (error) {
      console.error("Error blocking user:", error);
      message.error("Failed to block user");
    }
  };

  const showDeleteConfirm = (user) => {
    setSelectedUser(user);
    setDeleteModalVisible(true);
  };

  const showBlockConfirm = (user) => {
    setSelectedUser(user);
    setBlockModalVisible(true);
  };

  const handleModalSuccess = () => {
    setAddEditModalVisible(false);
    setSelectedUser(null);
    fetchUsers();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "green";
      case "inactive":
        return "red";
      default:
        return "default";
    }
  };

  const columns = [
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "firstName",
      sorter: true,
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "lastName",
      sorter: true,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: true,
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => <Tag color="blue">{role.toUpperCase()}</Tag>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={getStatusColor(status)}>{status.toUpperCase()}</Tag>
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: true,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handleViewUser(record)}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEditUser(record)}
            />
          </Tooltip>
          <Tooltip title="Block">
            <Button
              type="text"
              icon={<StopOutlined />}
              onClick={() => showBlockConfirm(record)}
              danger
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              type="text"
              icon={<DeleteOutlined />}
              onClick={() => showDeleteConfirm(record)}
              danger
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <AdminMainLayout>
      <Card>
        <div style={{ marginBottom: 16 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h1 style={{ margin: 0 }}>User Management</h1>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddUser}
            >
              Add User
            </Button>
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <Search
            placeholder="Search users by name or email"
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onSearch={handleSearch}
            style={{ maxWidth: 400 }}
          />
        </div>

        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} users`,
          }}
          onChange={handleTableChange}
          scroll={{ x: 800 }}
        />

        <AddEditUserModal
          visible={addEditModalVisible}
          mode={modalMode}
          user={selectedUser}
          onCancel={() => setAddEditModalVisible(false)}
          onSuccess={handleModalSuccess}
        />

        <ViewUserModal
          visible={viewModalVisible}
          user={selectedUser}
          onCancel={() => setViewModalVisible(false)}
        />

        {/* Delete Confirmation Modal */}
        <Modal
          title="Delete User"
          open={deleteModalVisible}
          onOk={() => handleDeleteUser(selectedUser?.id)}
          onCancel={() => setDeleteModalVisible(false)}
          okText="Yes, Delete"
          cancelText="Cancel"
          okType="danger"
        >
          <p>Are you sure you want to delete this user?</p>
          <p>
            <strong>
              {selectedUser?.firstName} {selectedUser?.lastName}
            </strong>{" "}
            ({selectedUser?.email})
          </p>
          <p style={{ color: "#ff4d4f", fontWeight: "bold" }}>
            This action cannot be undone.
          </p>
        </Modal>

        {/* Block Confirmation Modal */}
        <Modal
          title="Block User"
          open={blockModalVisible}
          onOk={() => handleBlockUser(selectedUser?.id)}
          onCancel={() => setBlockModalVisible(false)}
          okText="Yes, Block"
          cancelText="Cancel"
          okType="danger"
        >
          <p>Are you sure you want to block this user?</p>
          <p>
            <strong>
              {selectedUser?.firstName} {selectedUser?.lastName}
            </strong>{" "}
            ({selectedUser?.email})
          </p>
          <p style={{ color: "#ff7a00" }}>
            The user will be marked as inactive and won't be able to access the
            system.
          </p>
        </Modal>
      </Card>
    </AdminMainLayout>
  );
};

export default AdminUsers;
