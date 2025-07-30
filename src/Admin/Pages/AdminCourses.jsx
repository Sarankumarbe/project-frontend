import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Popconfirm,
  message,
  Upload,
  Image,
  Tooltip,
  Descriptions,
  Tag,
  Divider,
  Switch,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  SearchOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import AdminMainLayout from "../Components/AdminMainLayout";
import {
  useGetCoursesQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  useGetQuestionPapersQuery,
  useGetCourseByIdQuery,
} from "../../store/api/adminApi";

const { TextArea } = Input;
const { Option } = Select;
const { Search } = Input;

const AdminCourses = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [viewingCourseId, setViewingCourseId] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const [searchText, setSearchText] = useState("");

  // RTK Query hooks
  const {
    data: coursesResponse = {},
    isLoading,
    refetch,
  } = useGetCoursesQuery({
    page: pagination.current,
    limit: pagination.pageSize,
    search: searchText,
  });

  const { data: questionPapers = [] } = useGetQuestionPapersQuery();

  const { data: courseDetails, isLoading: isLoadingCourseDetails } =
    useGetCourseByIdQuery(viewingCourseId, {
      skip: !viewingCourseId,
    });

  // Query for editing course details
  const { data: editingCourseDetails, isLoading: isLoadingEditingCourse } =
    useGetCourseByIdQuery(editingCourseId, {
      skip: !editingCourseId,
    });

  const [createCourse, { isLoading: isCreating }] = useCreateCourseMutation();
  const [updateCourse, { isLoading: isUpdating }] = useUpdateCourseMutation();
  const [deleteCourse] = useDeleteCourseMutation();

  // Extract data from API response
  const courses = coursesResponse.courses || [];
  const totalCourses = coursesResponse.totalCourses || 0;

  useEffect(() => {
    if (editingCourseDetails && isModalVisible && editingCourseId) {
      if (!editingCourse || editingCourse._id !== editingCourseId) {
        const formData = {
          title: editingCourseDetails.title || "",
          description: editingCourseDetails.description || "",
          price: editingCourseDetails.price || 0,
          questionPapers:
            editingCourseDetails.questionPapers?.map((qp) => qp._id) || [],
        };

        console.log("Setting form values from API data:", formData);
        form.setFieldsValue(formData);
        setImagePreview(editingCourseDetails.image || "");
        setEditingCourse(editingCourseDetails);
      }
    }
  }, [editingCourseDetails, isModalVisible, editingCourseId]);

  // Table columns
  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      width: 100,
      render: (image) => {
        const imageUrl = image?.startsWith("http")
          ? image
          : `${import.meta.env.VITE_BACKEND_URL}/${image}`;

        return (
          <a href={imageUrl} target="_blank" rel="noopener noreferrer">
            <Image
              width={50}
              height={50}
              src={imageUrl}
              fallback="/placeholder-image.jpg"
              style={{ objectFit: "cover", borderRadius: 4 }}
            />
          </a>
        );
      },
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
      width: 300,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `₹${price}`,
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: "Question Papers",
      dataIndex: "questionPapers",
      key: "questionPapers",
      render: (questionPapers) => (
        <div>
          <div>{questionPapers?.length || 0} papers</div>
          {questionPapers?.length > 0 && (
            <div style={{ fontSize: "12px", color: "#666", marginTop: "2px" }}>
              {questionPapers.map((qp) => qp.title).join(", ")}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 150,
      render: (_, record) => (
        <Space>
          <Tooltip title="View Course Details">
            <Button
              type="primary"
              icon={<EyeOutlined />}
              size="small"
              onClick={() => handleView(record)}
            />
          </Tooltip>
          <Tooltip title="Edit Course">
            <Button
              type="primary"
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Are you sure you want to delete this course?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Delete Course">
              <Button
                type="primary"
                danger
                icon={<DeleteOutlined />}
                size="small"
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Modal handlers
  const showModal = () => {
    setIsModalVisible(true);
    setEditingCourse(null);
    form.resetFields();
    setImageFile(null);
    setImagePreview("");
  };

  const handleView = (course) => {
    setViewingCourseId(course._id);
    setIsViewModalVisible(true);
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setEditingCourseId(course._id);
    form.setFieldsValue({
      title: course.title,
      description: course.description,
      price: course.price,
      questionPapers: course.questionPapers?.map((qp) => qp._id),
    });
    setImagePreview(
      course.image?.startsWith("http")
        ? course.image
        : `${import.meta.env.VITE_BACKEND_URL}/${course.image}`
    );
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingCourse(null);
    setEditingCourseId(null); // Reset editing course ID
    form.resetFields();
    setImageFile(null);
    setImagePreview("");
  };

  const handleViewCancel = () => {
    setIsViewModalVisible(false);
    setViewingCourseId(null);
  };

  const handleSubmit = async (values) => {
    try {
      console.log("Form values on submit:", values);

      const formData = new FormData();

      // Add form fields to FormData
      formData.append("title", values.title || "");
      formData.append("description", values.description || "");
      formData.append("price", values.price || 0);

      // Handle question papers - ensure it's always an array
      const questionPapersArray = Array.isArray(values.questionPapers)
        ? values.questionPapers
        : [];
      formData.append("questionPapers", JSON.stringify(questionPapersArray));

      // Add image file if selected
      if (imageFile) {
        formData.append("image", imageFile);
      } else if (editingCourse?.image && !imageFile) {
        // If editing and no new image selected, keep the existing one
        formData.append("existingImage", editingCourse.image);
      }

      if (editingCourseId) {
        await updateCourse({
          id: editingCourseId,
          data: formData,
        }).unwrap();
        message.success("Course updated successfully!");
      } else {
        await createCourse(formData).unwrap();
        message.success("Course created successfully!");
      }

      setIsModalVisible(false);
      setEditingCourse(null);
      setEditingCourseId(null);
      form.resetFields();
      setImageFile(null);
      setImagePreview("");
      refetch();
    } catch (error) {
      console.error("Submit error:", error);
      message.error(
        error?.data?.message || "An error occurred while saving the course"
      );
    }
  };

  const handleDelete = async (courseId) => {
    try {
      await deleteCourse(courseId).unwrap();
      message.success("Course deleted successfully!");
      refetch();
    } catch (error) {
      message.error(
        error?.data?.message || "An error occurred while deleting the course"
      );
    }
  };

  // Handle search
  const handleSearch = (value) => {
    setSearchText(value);
    setPagination({ ...pagination, current: 1 });
  };

  const handleTableChange = (paginationInfo) => {
    setPagination({
      current: paginationInfo.current,
      pageSize: paginationInfo.pageSize,
    });
  };

  // Handle image file selection
  const handleImageChange = (info) => {
    const file = info.file.originFileObj || info.file;

    if (file && file.type.startsWith("image/")) {
      setImageFile(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);

      message.success("Image selected successfully!");
    }
  };

  // Remove selected image
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview("");
  };

  // Custom upload props
  const uploadProps = {
    name: "image",
    showUploadList: false,
    beforeUpload: (file) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("You can only upload image files!");
        return false;
      }
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error("Image must be smaller than 5MB!");
        return false;
      }

      setImageFile(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);

      message.success("Image selected successfully!");
      return false;
    },
  };

  return (
    <AdminMainLayout>
      <div style={{ padding: "24px" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <h1 style={{ margin: 0, fontSize: "24px", fontWeight: "600" }}>
            Courses Management
          </h1>
          <Tooltip title="Create New Course">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              size="large"
              onClick={showModal}
            >
              Create Course
            </Button>
          </Tooltip>
        </div>

        {/* Search Bar */}
        <div style={{ marginBottom: "16px" }}>
          <Search
            placeholder="Search courses by title..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onSearch={handleSearch}
            style={{ maxWidth: 400 }}
          />
        </div>

        {/* Courses Table */}
        <Table
          columns={columns}
          dataSource={courses}
          rowKey="_id"
          loading={isLoading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: totalCourses,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} courses`,
            pageSizeOptions: ["5", "10", "20", "50"],
          }}
          onChange={handleTableChange}
          scroll={{ x: 800 }}
        />

        {/* View Course Details Modal */}
        <Modal
          title="Course Details"
          open={isViewModalVisible}
          onCancel={handleViewCancel}
          footer={[
            <Button key="close" onClick={handleViewCancel}>
              Close
            </Button>,
            <Button
              key="edit"
              type="primary"
              icon={<EditOutlined />}
              onClick={() => {
                handleViewCancel();
                if (courseDetails) {
                  handleEdit(courseDetails);
                }
              }}
              disabled={!courseDetails}
            >
              Edit Course
            </Button>,
          ]}
          width={700}
          destroyOnClose
        >
          {isLoadingCourseDetails ? (
            <div style={{ textAlign: "center", padding: "50px" }}>
              Loading course details...
            </div>
          ) : courseDetails ? (
            <div>
              {courseDetails.image && (
                <div style={{ textAlign: "center", marginBottom: "24px" }}>
                  <Image
                    width={200}
                    height={150}
                    src={
                      courseDetails.image?.startsWith("http")
                        ? courseDetails.image
                        : `${import.meta.env.VITE_BACKEND_URL}/${
                            courseDetails.image
                          }`
                    }
                    style={{ objectFit: "cover", borderRadius: 8 }}
                    fallback="/placeholder-image.jpg"
                  />
                </div>
              )}

              <Descriptions
                title="Course Information"
                bordered
                column={1}
                size="middle"
              >
                <Descriptions.Item label="Title">
                  <strong>{courseDetails.title}</strong>
                </Descriptions.Item>
                <Descriptions.Item label="Description">
                  {courseDetails.description}
                </Descriptions.Item>
                <Descriptions.Item label="Price">
                  <Tag
                    color="green"
                    style={{ fontSize: "14px", padding: "4px 8px" }}
                  >
                    ₹{courseDetails.price?.toLocaleString()}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Created Date">
                  {courseDetails.createdAt
                    ? new Date(courseDetails.createdAt).toLocaleDateString(
                        "en-IN",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )
                    : "N/A"}
                </Descriptions.Item>
              </Descriptions>

              <Divider />

              <div>
                <h3 style={{ marginBottom: "16px" }}>
                  Question Papers ({courseDetails.questionPapers?.length || 0})
                </h3>
                {courseDetails.questionPapers?.length > 0 ? (
                  <div
                    style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}
                  >
                    {courseDetails.questionPapers.map((qp, index) => (
                      <Tag
                        key={qp._id || index}
                        color="blue"
                        style={{ marginBottom: "8px", padding: "4px 8px" }}
                      >
                        {qp.title || qp.name || `Question Paper ${index + 1}`}
                      </Tag>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: "#999", fontStyle: "italic" }}>
                    No question papers assigned to this course.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div
              style={{ textAlign: "center", padding: "50px", color: "#999" }}
            >
              Course details not found.
            </div>
          )}
        </Modal>

        {/* Create/Edit Course Modal */}
        <Modal
          title={editingCourseId ? "Edit Course" : "Create New Course"}
          open={isModalVisible}
          onCancel={handleCancel}
          footer={null}
          width={600}
          destroyOnClose
        >
          {isLoadingEditingCourse && editingCourseId ? (
            <div style={{ textAlign: "center", padding: "50px" }}>
              Loading course details...
            </div>
          ) : (
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
              <Form.Item
                label="Course Title"
                name="title"
                rules={[
                  { required: true, message: "Please enter course title!" },
                  { min: 3, message: "Title must be at least 3 characters!" },
                ]}
              >
                <Input placeholder="Enter course title" size="large" />
              </Form.Item>

              <Form.Item
                label="Description"
                name="description"
                rules={[
                  {
                    required: true,
                    message: "Please enter course description!",
                  },
                  {
                    min: 10,
                    message: "Description must be at least 10 characters!",
                  },
                ]}
              >
                <TextArea
                  rows={4}
                  placeholder="Enter course description"
                  showCount
                  maxLength={500}
                />
              </Form.Item>

              <Form.Item label="Course Image">
                <div>
                  <Upload {...uploadProps}>
                    <Button icon={<UploadOutlined />}>
                      {imageFile ? "Change Image" : "Upload Image"}
                    </Button>
                  </Upload>

                  {(imagePreview || (editingCourse?.image && !imageFile)) && (
                    <div style={{ marginTop: 16 }}>
                      <div
                        style={{
                          position: "relative",
                          display: "inline-block",
                        }}
                      >
                        <Image
                          width={150}
                          height={120}
                          src={
                            imagePreview ||
                            (editingCourse?.image?.startsWith("http")
                              ? editingCourse.image
                              : `${import.meta.env.VITE_BACKEND_URL}/${
                                  editingCourse.image
                                }`)
                          }
                          style={{ objectFit: "cover", borderRadius: 8 }}
                          fallback="/placeholder-image.jpg"
                        />
                        <Button
                          type="primary"
                          danger
                          size="small"
                          onClick={handleRemoveImage}
                          style={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            minWidth: "auto",
                            padding: "4px 8px",
                          }}
                        >
                          ×
                        </Button>
                      </div>
                      <div
                        style={{
                          marginTop: 8,
                          fontSize: "12px",
                          color: "#666",
                        }}
                      >
                        {imageFile
                          ? `Selected: ${imageFile.name}`
                          : "Current image"}
                      </div>
                    </div>
                  )}
                </div>
              </Form.Item>

              <Form.Item
                label="Price (₹)"
                name="price"
                rules={[
                  { required: true, message: "Please enter course price!" },
                  {
                    type: "number",
                    min: 0,
                    message: "Price must be positive!",
                  },
                ]}
              >
                <InputNumber
                  placeholder="Enter course price"
                  size="large"
                  style={{ width: "100%" }}
                  formatter={(value) =>
                    `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/₹\s?|(,*)/g, "")}
                />
              </Form.Item>

              <Form.Item
                label="Question Papers"
                name="questionPapers"
                rules={[
                  {
                    required: true,
                    message: "Please select at least one question paper!",
                  },
                ]}
              >
                <Select
                  mode="multiple"
                  placeholder="Select question papers"
                  size="large"
                  showSearch
                  filterOption={(input, option) =>
                    option?.children
                      ?.toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  loading={!questionPapers.length}
                  optionFilterProp="children"
                >
                  {questionPapers.map((qp) => (
                    <Option key={qp._id} value={qp._id}>
                      {qp.title}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Course Pack"
                name="coursePack"
                rules={[
                  { required: true, message: "Please select a course pack!" },
                ]}
              >
                <Select placeholder="Select course pack" size="large">
                  <Option value="basic">Basic</Option>
                  <Option value="silver">Silver</Option>
                  <Option value="gold">Gold</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Is Common?"
                name="isCommon"
                valuePropName="checked"
              >
                <Switch checkedChildren="Yes" unCheckedChildren="No" />
              </Form.Item>

              <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
                <Space>
                  <Button onClick={handleCancel}>Cancel</Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={isCreating || isUpdating}
                    size="large"
                  >
                    {editingCourseId ? "Update Course" : "Create Course"}
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          )}
        </Modal>
      </div>
    </AdminMainLayout>
  );
};

export default AdminCourses;
