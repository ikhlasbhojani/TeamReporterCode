import { createContext, useState, useContext, useEffect } from "react";
import { ContextProvider } from "./context";
import {
  getAnswersData,
  getTodayDate,
  isMemberAnswerSendToday,
} from "../helpers/HelperFunctions";

export const ReportContextProvider = createContext({
  answers: [],
  setAnswersState: null,
  isInswerAvailable: null,
});

const ReportContext = ({ children }) => {
  const { teamId } = useContext(ContextProvider);
  const [answers, setAnswers] = useState([]);
  const [isInswerAvailable, setIsAnswerAvailable] = useState(false);

  const setAnswersState = (date) => {
    const helperAnswersArray = [];
    getAnswersData(teamId)
      .then((data) => {
        for (const answers in data[date]) {
          helperAnswersArray.push(data[date][answers]);
        }
      })
      .then(() => {
        setAnswers(helperAnswersArray);
      });
  };

  const reportContextValue = {
    answers,
    setAnswersState,
    isInswerAvailable,
  };

  useEffect(() => {
    const helperAnswersArray = [];
    getAnswersData(teamId)
      .then((data) => {
        if (data) {
          setIsAnswerAvailable(true);
        }
        for (const answers in data[getTodayDate()]) {
          helperAnswersArray.push(data[getTodayDate()][answers]);
          isMemberAnswerSendToday(answers, data[getTodayDate()][answers]);
        }
      })
      .then(() => {
        setAnswers(helperAnswersArray);
      });
  }, [teamId]);

  return (
    <ReportContextProvider.Provider value={reportContextValue}>
      {children}
    </ReportContextProvider.Provider>
  );
};

export default ReportContext;
