import React, { useContext } from "react";
import { DatePicker, Space } from "antd";
import { ReportContextProvider } from "../context/reportContext";

const Calender = ({ className }) => {
  const { setAnswersState } = useContext(ReportContextProvider);
  const onChange = (date, dateString) => {
    let str = dateString.slice(0, 4);

    dateString[5] !== "0"
      ? (str += `|${dateString.slice(5, 7)}`)
      : (str += `|${dateString.slice(6, 7)}`);

    dateString[8] !== "0"
      ? (str += `|${dateString.slice(8)}`)
      : (str += `|${dateString.slice(9)}`);

    setAnswersState(str);
  };

  return (
    <Space direction="vertical">
      <DatePicker onChange={onChange} className={className} />
    </Space>
  );
};

export default Calender;
