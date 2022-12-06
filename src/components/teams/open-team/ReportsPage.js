import React, { useContext } from "react";
import { ReportContextProvider } from "../../../context/reportContext";
import Calender from "../../../UI/Calender";
import AnswerItem from "./AnswerItem";
import classes from "./css/ReportPage.module.css";

const ReportsPage = () => {
  const { answers, isInswerAvailable } = useContext(ReportContextProvider);

  return (
    <>
      {isInswerAvailable && <Calender className={classes.calender} />}
      <div className={classes.container}>
        <ul>
          {answers.map((answer) => {
            return <AnswerItem answer={answer} key={Math.random()} />;
          })}
        </ul>
      </div>
    </>
  );
};

export default ReportsPage;
