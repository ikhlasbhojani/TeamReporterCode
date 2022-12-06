import { createContext, useState, useContext } from "react";
import {
  emailChekHandler,
  getName,
  deleteDataToServer,
  getQA,
  objChekHandler,
  answersMaker,
  sendDataToFirebase,
  sendMembersData,
} from "../helpers/HelperFunctions.js";
import { ref, onValue, remove } from "firebase/database";
import { database, ContextProvider } from "../context/context";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export const SettingsContextProvider = createContext({
  loadingSpinner: null,
  question1: "",
  question2: "",
  question3: "",
  setQuestion1: "",
  setQuestion2: "",
  setQuestion3: "",
  teamMembers: [],
  deleteUserHandler: null,
  emailVal: "",
  setEmailVal: null,
  addUserHandler: null,
  saveChangesHandler: null,
  cancleHandler: null,
  deleteTeamHandler: null,
});

const SettingContext = ({ children }) => {
  const navigate = useNavigate();
  const { teamId, putData } = useContext(ContextProvider);
  const [initialTeamMembers, setInitialTeamMembers] = useState([]);
  const [initialQuestions, setInitialQuestions] = useState({});
  const [team, setTeam] = useState([]);
  const [loadingSpinner, setLoadingSpinner] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);
  const [deleteMembers, setDeleteMembers] = useState([]);
  const [question1, setQuestion1] = useState("");
  const [question2, setQuestion2] = useState("");
  const [question3, setQuestion3] = useState("");
  const [emailVal, setEmailVal] = useState("");

  const resetHandler = () => {
    setLoadingSpinner(false);
    setInitialTeamMembers([]);
    setDeleteMembers([]);
    setEmailVal("");
  };

  const updateStates = (value) => {
    setTeam(value);
    setTeamMembers(value.members ? value.members : []);
    setInitialTeamMembers(value.members ? value.members : []);
    if (value.questions) {
      setQuestion1(value.questions.question1);
      setQuestion2(value.questions.question2);
      setQuestion3(value.questions.question3);
      setInitialQuestions(value.questions);
    }
  };

  const getDataToServer = () => {
    setLoadingSpinner(true);
    const starCountRef = ref(
      database,
      `users/${localStorage.getItem("email")}/teams/own/${teamId}`
    );
    onValue(
      starCountRef,
      (snapshot) => {
        if (snapshot.exists()) {
          updateStates(snapshot.val());
        }
        setLoadingSpinner(false);
      },
      { onlyOnce: true }
    );
  };

  const saveChangesHandler = () => {
    setLoadingSpinner(true);

    const teamData = {
      ...team,
      members: teamMembers,
    };

    const QA = getQA([question1, question2, question3]);
    if (objChekHandler(QA.questions)) {
      teamData.questions = QA.questions;
      teamData.answers = answersMaker(teamMembers, QA.answers, teamData);
    }

    sendDataToFirebase(
      `users/${localStorage.getItem("email")}/teams/own/${teamId}`,
      teamData,
      putData
    )
      .then(() => {
        sendMembersData(teamMembers, putData, teamData, teamId);
      })
      .catch((err) => {
        setLoadingSpinner(false);
        throw new Error(err);
      })
      .then(() => {
        resetHandler();
        getDataToServer();
      })
      .catch((err) => {
        setLoadingSpinner(false);
        throw new Error(err);
      });

    if (deleteMembers.length > 0) {
      deleteDataToServer(teamId, deleteMembers).then(() => {
        setDeleteMembers([]);
      });
    }
  };

  useEffect(() => {
    const starCountRef = ref(
      database,
      `users/${localStorage.getItem("email")}/teams/own/${teamId}`
    );
    onValue(
      starCountRef,
      (snapshot) => {
        if (snapshot.exists()) {
          updateStates(snapshot.val());
        }
      },
      { onlyOnce: true }
    );
  }, [teamId]);

  const addUserHandler = () => {
    if (emailChekHandler(emailVal)) {
      setTeamMembers((prevMembers) =>
        prevMembers.filter((member) => member.email !== emailVal)
      );
      getName(emailVal).then((name) => {
        setTeamMembers((prevEmail) => [
          ...prevEmail,
          { email: emailVal, name: name },
        ]);
      });
    }
    setEmailVal("");
  };

  const deleteUserHandler = (delteEmail) => {
    setTeamMembers((members) =>
      members.filter((member) => member.email !== delteEmail)
    );
    setDeleteMembers((prevMembers) => [...prevMembers, delteEmail]);
  };

  const cancleHandler = () => {
    setTeamMembers(initialTeamMembers);
    setEmailVal("");
    setQuestion1(initialQuestions.question1);
    setQuestion2(initialQuestions.question2);
    setQuestion3(initialQuestions.question3);
  };

  const deleteTeamHandler = () => {
    const ownTeam = ref(
      database,
      `users/${localStorage.getItem("email")}/teams/own/${teamId}`
    );
    remove(ownTeam);

    initialTeamMembers.forEach((member) => {
      const partOfTeam = ref(
        database,
        `users/${member.email.slice(0, -4)}/teams/partOf/${teamId}`
      );

      remove(partOfTeam);
    });
    navigate("/");
  };

  const settingContextValue = {
    loadingSpinner,
    question1,
    question2,
    question3,
    setQuestion1,
    setQuestion2,
    setQuestion3,
    teamMembers,
    deleteUserHandler,
    emailVal,
    setEmailVal,
    addUserHandler,
    saveChangesHandler,
    cancleHandler,
    deleteTeamHandler,
  };

  return (
    <SettingsContextProvider.Provider value={settingContextValue}>
      {children}
    </SettingsContextProvider.Provider>
  );
};

export default SettingContext;
