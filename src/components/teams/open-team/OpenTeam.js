import { useContext, useState } from "react";
import { Menu } from "antd";
import { MailOutlined, SettingOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { BsBoxArrowUpLeft } from "react-icons/bs";
import { ContextProvider } from "../../../context/context";
import ReportsPage from "./ReportsPage";
import SettingsPage from "./SettingsPage";
import SettingContext from "../../../context/settingsContext";
import ReportContext from "../../../context/reportContext";

const OpenTeam = () => {
  const { setLoadingSpinnerIsVisible } = useContext(ContextProvider);
  const [reportsPageIsVisible, setReportsPageIsVisible] = useState(true);

  const navigate = useNavigate();
  const goBackHandler = () => {
    setLoadingSpinnerIsVisible(true);
    setTimeout(() => {
      setLoadingSpinnerIsVisible(false);
    }, 500);
    navigate("/teams");
  };

  const reportPageVisibleHandler = () => {
    setReportsPageIsVisible(true);
  };

  const settingPageVisibleHandler = () => {
    setReportsPageIsVisible(false);
  };

  const items = [
    {
      icon: <BsBoxArrowUpLeft />,
      label: "Back",
      key: "one",
      onClick: goBackHandler,
    },
    {
      icon: <MailOutlined />,
      label: "Reports",
      key: "two",
      onClick: reportPageVisibleHandler,
    },
    {
      icon: <SettingOutlined />,
      label: "Settings",
      key: "three",
      onClick: settingPageVisibleHandler,
    },
  ];

  return (
    <SettingContext>
      <ReportContext>
        <Menu mode="horizontal" defaultSelectedKeys={["two"]} items={items} />
        {reportsPageIsVisible ? <ReportsPage /> : <SettingsPage />}
      </ReportContext>
    </SettingContext>
  );
};

export default OpenTeam;
