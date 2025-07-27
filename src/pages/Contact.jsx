import MainPageLayout from "../layouts/MainPageLayout";
import { Typography, Row, Col, Form, Input, Button, message } from "antd";
import {
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

const Contact = () => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log("Received values:", values);
    message.success("Your message has been sent successfully!");
    form.resetFields();
  };

  return (
    <MainPageLayout>
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <Title level={2} style={{ color: "#1890ff" }}>
          Contact Us
        </Title>
        <Paragraph style={{ fontSize: 18, maxWidth: 800, margin: "0 auto" }}>
          Have questions? We're here to help. Send us a message and we'll
          respond as soon as possible.
        </Paragraph>
      </div>

      <Row gutter={[48, 24]}>
        <Col xs={24} md={12}>
          <Form
            form={form}
            name="contact-form"
            onFinish={onFinish}
            layout="vertical"
          >
            <Form.Item
              name="name"
              label="Your Name"
              rules={[{ required: true, message: "Please input your name!" }]}
            >
              <Input size="large" />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email Address"
              rules={[
                { required: true, message: "Please input your email!" },
                { type: "email", message: "Please enter a valid email!" },
              ]}
            >
              <Input size="large" />
            </Form.Item>
            <Form.Item
              name="subject"
              label="Subject"
              rules={[{ required: true, message: "Please input a subject!" }]}
            >
              <Input size="large" />
            </Form.Item>
            <Form.Item
              name="message"
              label="Message"
              rules={[
                { required: true, message: "Please input your message!" },
              ]}
            >
              <TextArea rows={6} size="large" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" size="large">
                Send Message
              </Button>
            </Form.Item>
          </Form>
        </Col>
        <Col xs={24} md={12}>
          <div style={{ marginBottom: 32 }}>
            <Title level={4}>Contact Information</Title>
            <Paragraph style={{ fontSize: 16 }}>
              <EnvironmentOutlined
                style={{ color: "#1890ff", marginRight: 8 }}
              />
              123 Education Street, Learning City
            </Paragraph>
            <Paragraph style={{ fontSize: 16 }}>
              <PhoneOutlined style={{ color: "#1890ff", marginRight: 8 }} />
              +1 234 567 8900
            </Paragraph>
            <Paragraph style={{ fontSize: 16 }}>
              <MailOutlined style={{ color: "#1890ff", marginRight: 8 }} />
              info@testplatform.com
            </Paragraph>
          </div>
          <div>
            <Title level={4}>Business Hours</Title>
            <Paragraph style={{ fontSize: 16 }}>
              Monday - Friday: 9:00 AM - 6:00 PM
            </Paragraph>
            <Paragraph style={{ fontSize: 16 }}>
              Saturday: 10:00 AM - 4:00 PM
            </Paragraph>
            <Paragraph style={{ fontSize: 16 }}>Sunday: Closed</Paragraph>
          </div>
        </Col>
      </Row>
    </MainPageLayout>
  );
};

export default Contact;
