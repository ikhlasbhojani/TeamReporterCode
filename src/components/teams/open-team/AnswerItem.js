import React, { useState, useEffect } from "react";
import { getMonth } from "../../../helpers/HelperFunctions";
import classes from "./css/AnswerItem.module.css";

const AnswerItem = ({ answer }) => {
  const [questionArray, setQuestionArray] = useState([]);

  const getDate = (date) => {
    const dateObj = new Date();
    let str = date.date + "th ";
    str += getMonth(date.month);

    if (date.year !== dateObj.getFullYear()) {
      str += " " + date.year;
    }

    return str;
  };

  useEffect(() => {
    for (const key in answer.answers) {
      setQuestionArray((pre) => [...pre, key]);
    }
  }, [answer.answers]);

  const submitDesider = () => {
    if (
      !answer.answers[questionArray[0]] &&
      !answer.answers[questionArray[1]] &&
      !answer.answers[questionArray[2]]
    ) {
      return " | Not submitted yet";
    }
    return "";
  };

  return (
    <li className={classes.listItem}>
      <div className="infoBox">
        <p>
          {answer.name} : {getDate(answer.date)} {submitDesider()}
        </p>
      </div>

      <ul>
        {questionArray[0] && (
          <li className={classes.listItem}>
            <p>Q. {questionArray[0]}</p>
            <p>A. {answer.answers[questionArray[0]]}</p>
          </li>
        )}
        {questionArray[1] && (
          <li className={classes.listItem}>
            <p>Q. {questionArray[1]}</p>
            <p>A. {answer.answers[questionArray[1]]}</p>
          </li>
        )}
        {questionArray[2] && (
          <li className={classes.listItem}>
            <p>Q. {questionArray[2]}</p>
            <p>A. {answer.answers[questionArray[2]]}</p>
          </li>
        )}
      </ul>
    </li>
  );
};

export default AnswerItem;
