import { useState, useEffect, useContext } from "react";
import { ContextProvider, database } from "../../../context/context";
import { ref, onValue } from "firebase/database";
import classes from "./css/MemberPage.module.css";
import { Input, Button } from "antd";
import { FaRegEdit } from "react-icons/fa";
import { BsBoxArrowUpLeft } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

const MemberPage = () => {
  const navigate = useNavigate();
  const { teamId, putData } = useContext(ContextProvider);
  const [questions, setQuestions] = useState([]);
  const [answer1, setAnswer1] = useState("");
  const [answer2, setAnswer2] = useState("");
  const [answer3, setAnswer3] = useState("");
  const submitHandler = () => {
    const date = new Date();
    if (!answer1 && !answer2 && !answer3) {
      return;
    }

    if (localStorage.getItem(teamId + "send")) {
      alert("You have already send answers today!");
      setAnswer1("");
      setAnswer2("");
      setAnswer3("");
      return;
    }

    const answers = {};

    if (questions[0]) {
      answers[questions[0]] = answer1;
    }
    if (questions[1]) {
      answers[questions[1]] = answer2;
    }
    if (questions[2]) {
      answers[questions[2]] = answer3;
    }

    localStorage.setItem(teamId + "send", true);

    setTimeout(() => {
      localStorage.removeItem(teamId + "send");
    }, 86400000);

    putData(
      `users/${localStorage.getItem(
        "admin"
      )}/teams/own/${teamId}/answers/${date.getFullYear()}|${
        date.getMonth() + 1
      }|${date.getDate()}/${localStorage.getItem("email")}`,
      {
        name: localStorage.getItem("name"),
        answers,
        date: {
          year: date.getFullYear(),
          month: date.getMonth(),
          date: date.getDate(),
        },
      }
    ).then(() => {
      setAnswer1("");
      setAnswer2("");
      setAnswer3("");
    });
  };

  useEffect(() => {
    const starCountRef = ref(
      database,
      `users/${localStorage.getItem("email")}/teams/partOf/${teamId}`
    );
    onValue(starCountRef, (snapshot) => {
      if (snapshot.exists()) {
        localStorage.setItem("admin", snapshot.val().admin);
        if (
          snapshot.val().questions &&
          !localStorage.getItem(teamId + "send")
        ) {
          const helperArray = [];
          for (const key in snapshot.val().questions) {
            snapshot.val().questions[key] &&
              helperArray.push(snapshot.val().questions[key]);
          }
          setQuestions(helperArray);
        }
      }
    });
  }, [teamId]);

  return (
    <div className={classes.container}>
      <Button
        className={classes.btn}
        icon={<BsBoxArrowUpLeft size={22} />}
        onClick={() => navigate("/")}
      />
      {questions[0] || questions[1] || questions[2] ? (
        <ul className={classes.list}>
          {questions[0] && (
            <li className={classes.listItem}>
              <h3>{questions[0]}</h3>
              <Input
                placeholder="Answer"
                bordered={false}
                onChange={(e) => setAnswer1(e.target.value)}
                value={answer1}
              />
            </li>
          )}
          {questions[1] && (
            <li className={classes.listItem}>
              <h3>{questions[1]}</h3>
              <Input
                placeholder="Answer"
                bordered={false}
                onChange={(e) => setAnswer2(e.target.value)}
                value={answer2}
              />
            </li>
          )}
          {questions[2] && (
            <li className={classes.listItem}>
              <h3>{questions[2]}</h3>
              <Input
                placeholder="Answer"
                bordered={false}
                onChange={(e) => setAnswer3(e.target.value)}
                value={answer3}
              />
            </li>
          )}
          <li>
            <Button type="primary" icon={<FaRegEdit />} onClick={submitHandler}>
              &nbsp;Submit
            </Button>
          </li>
        </ul>
      ) : (
        <div className={classes.emptyHeadingCont}>
          <h1 className={classes.emptyHeading}>This page is empty !</h1>
        </div>
      )}
    </div>
  );
};

export default MemberPage;
