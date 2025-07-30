import React from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Button,
} from "antd";
import moment from "moment";

const CouponForm = ({ visible, onCancel, onSubmit, initialValues, isEdit }) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (visible) {
      form.resetFields();
      if (initialValues) {
        form.setFieldsValue({
          ...initialValues,
          expiryDate: initialValues.expiryDate
            ? moment(initialValues.expiryDate)
            : null,
        });
      }
    }
  }, [visible, initialValues, form]);

  const onFinish = (values) => {
    onSubmit(values);
    form.resetFields();
  };

  return (
    <Modal
      title={isEdit ? "Edit Coupon" : "Create New Coupon"}
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={700}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="title"
          label="Coupon Title"
          rules={[{ required: true, message: "Please input coupon title!" }]}
        >
          <Input placeholder="e.g. Summer Sale" />
        </Form.Item>

        <Form.Item
          name="code"
          label="Coupon Code"
          rules={[{ required: true, message: "Please input coupon code!" }]}
        >
          <Input placeholder="e.g. SUMMER20" />
        </Form.Item>

        <Form.Item
          name="type"
          label="Coupon Type"
          rules={[{ required: true, message: "Please select coupon type!" }]}
        >
          <Select>
            <Select.Option value="percentage">Percentage</Select.Option>
            <Select.Option value="flat">Flat Amount</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) =>
            prevValues.type !== currentValues.type
          }
        >
          {({ getFieldValue }) => {
            const type = getFieldValue("type");
            if (type === "percentage") {
              return (
                <Form.Item
                  name="value"
                  label="Discount Percentage"
                  rules={[
                    {
                      required: true,
                      message: "Please input discount percentage!",
                    },
                  ]}
                >
                  <InputNumber
                    min={1}
                    max={100}
                    formatter={(value) => `${value}%`}
                    parser={(value) => value.replace("%", "")}
                  />
                </Form.Item>
              );
            }
            return (
              <Form.Item
                name="value"
                label="Discount Amount"
                rules={[
                  { required: true, message: "Please input discount amount!" },
                ]}
              >
                <InputNumber
                  min={1}
                  formatter={(value) => `₹${value}`}
                  parser={(value) => value.replace("₹", "")}
                />
              </Form.Item>
            );
          }}
        </Form.Item>

        <Form.Item
          name="minAmount"
          label="Minimum Order Amount"
          rules={[
            { required: true, message: "Please input minimum order amount!" },
          ]}
        >
          <InputNumber
            min={0}
            formatter={(value) => `₹${value}`}
            parser={(value) => value.replace("₹", "")}
          />
        </Form.Item>

        <Form.Item
          name="expiryDate"
          label="Expiry Date"
          rules={[{ required: true, message: "Please select expiry date!" }]}
        >
          <DatePicker
            style={{ width: "100%" }}
            disabledDate={(current) =>
              current && current < moment().startOf("day")
            }
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            {isEdit ? "Update Coupon" : "Create Coupon"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CouponForm;
