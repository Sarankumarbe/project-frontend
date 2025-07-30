import React from "react";
import { Modal, Card, Row, Col, Statistic, Tag } from "antd";
import moment from "moment";

const ViewCouponModal = ({ visible, coupon, onCancel }) => {
  if (!coupon) return null;

  return (
    <Modal
      title="Coupon Details"
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={700}
    >
      <Card bordered={false}>
        <Row gutter={16}>
          <Col span={12}>
            <Statistic title="Coupon Title" value={coupon.title} />
          </Col>
          <Col span={12}>
            <Statistic title="Coupon Code" value={coupon.code} />
          </Col>
        </Row>
        <Row gutter={16} style={{ marginTop: 24 }}>
          <Col span={12}>
            <Statistic
              title="Discount Value"
              value={
                coupon.type === "percentage"
                  ? `${coupon.value}%`
                  : `₹${coupon.value}`
              }
            />
          </Col>
          <Col span={12}>
            <Statistic title="Coupon Type" value={coupon.type} />
          </Col>
        </Row>
        <Row gutter={16} style={{ marginTop: 24 }}>
          <Col span={12}>
            <Statistic
              title="Minimum Order Amount"
              value={`₹${coupon.minAmount}`}
            />
          </Col>
          <Col span={12}>
            <Statistic
              title="Status"
              value={
                coupon.active ? (
                  <Tag color="green">Active</Tag>
                ) : (
                  <Tag color="red">Inactive</Tag>
                )
              }
            />
          </Col>
        </Row>
        <Row gutter={16} style={{ marginTop: 24 }}>
          <Col span={12}>
            <Statistic
              title="Expiry Date"
              value={moment(coupon.expiryDate).format("DD/MM/YYYY")}
            />
          </Col>
          <Col span={12}>
            <Statistic
              title="Created At"
              value={moment(coupon.createdAt).format("DD/MM/YYYY")}
            />
          </Col>
        </Row>
      </Card>
    </Modal>
  );
};

export default ViewCouponModal;
