import { LoadingOutlined } from "@ant-design/icons";
import { Space, Spin } from "antd";
import classes from "./LoadingSpinner.module.css";

export const LoddingSpinnerSmall = () => {
  const antIcon = (
    <LoadingOutlined
      style={{
        fontSize: 24,
      }}
      spin
    />
  );

  return <Spin indicator={antIcon} />;
};

const LoadingSpinner = () => {
  return (
    <Space size="middle" className={classes.spinner}>
      <Spin size="large" />
    </Space>
  );
};

export default LoadingSpinner;
