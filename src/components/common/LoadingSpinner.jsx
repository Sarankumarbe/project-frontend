import React from "react";
import { Spin } from "antd";

const LoadingSpinner = ({ size = "large", tip = "Loading..." }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "200px",
        flexDirection: "column",
      }}
    >
      <Spin size={size} tip={tip} />
    </div>
  );
};

export default LoadingSpinner;
