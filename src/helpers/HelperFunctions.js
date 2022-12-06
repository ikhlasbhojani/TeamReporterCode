import { database } from "../context/context";
import { ref, onValue, remove } from "firebase/database";

// Email cheking function
export const emailChekHandler = (emailVal) => {
  const email = emailVal;
  return !!email
    .trim()
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

// Get user name function
export const getName = (emailVal) => {
  return new Promise((resolve, reject) => {
    const starCountRef = ref(database, `users/${emailVal.slice(0, -4)}/name`);
    onValue(starCountRef, (snapshot) => {
      resolve(snapshot.val());
    });
  });
};

// Get Answers
export const getAnswersData = (teamId) => {
  return new Promise((resolve, reject) => {
    const starCountRef = ref(
      database,
      `users/${localStorage.getItem("email")}/teams/own/${teamId}/answers`
    );
    onValue(starCountRef, (snapshot) => {
      if (snapshot.exists()) {
        resolve(snapshot.val());
      }
    });
  });
};

// Delete Data To Server
export const deleteDataToServer = (teamId, deleteMembers) => {
  return new Promise((resolve, reject) => {
    let itemsProcessed = 0;
    deleteMembers.forEach((email, index, array) => {
      const partOfTeam = ref(
        database,
        `users/${email.slice(0, -4)}/teams/partOf/${teamId}`
      );
      remove(partOfTeam);
      itemsProcessed++;
      if (itemsProcessed === array.length) {
        resolve();
      }
    });
  });
};

// Get Questions/Answer Object
export const getQA = (value) => {
  const questions = {};
  const answers = {};

  if (value[0]) {
    questions.question1 = value[0];
    answers[value[0]] = "";
  }
  if (value[1]) {
    questions.question2 = value[1];
    answers[value[1]] = "";
  }
  if (value[2]) {
    questions.question3 = value[2];
    answers[value[2]] = "";
  }

  return { questions, answers };
};

// Object Chek
export const objChekHandler = (obj) => {
  let condition = false;
  for (const key in obj) {
    if (obj[key]) {
      condition = true;
    }
  }
  return condition;
};

// Get Today Date Function
export const getTodayDate = () => {
  const date = new Date();
  return `${date.getFullYear()}|${date.getMonth() + 1}|${date.getDate()}`;
};

// Make Anwers Function
export const answersMaker = (teamMembers, answers, teamData) => {
  const date = new Date();
  const initialAnswers = {};
  teamMembers.forEach((member) => {
    if (localStorage.getItem(member.email.slice(0, -4) + "Send")) {
      initialAnswers[member.email.slice(0, -4)] = {
        answers: JSON.parse(
          localStorage.getItem(member.email.slice(0, -4) + "Send")
        ),
        date: {
          year: date.getFullYear(),
          month: date.getMonth(),
          date: date.getDate(),
        },
        name: member.name,
      };
    } else {
      initialAnswers[member.email.slice(0, -4)] = {
        answers,
        date: {
          year: date.getFullYear(),
          month: date.getMonth(),
          date: date.getDate(),
        },
        name: member.name,
      };
    }
  });
  const todayDate = getTodayDate();
  const prevAnswers = teamData.answer ? { ...teamData.answers } : {};
  return { ...prevAnswers, [todayDate]: initialAnswers };
};

// Send Data To Firbase
export const sendDataToFirebase = (key, teamData, putData) => {
  teamData.members = teamData.members.filter(
    (member) => member.email !== localStorage.getItem("email") + ".com"
  );
  return new Promise((resolve, reject) => {
    putData(key, teamData)
      .then(() => resolve())
      .catch((err) => {
        reject();
      });
  });
};

// Send Members Data To Firebase
export const sendMembersData = (teamMembers, putData, teamData, teamId) => {
  teamData.members.push({
    email: localStorage.getItem("email") + ".com",
    name: localStorage.getItem("name"),
  });
  delete teamData.answers;
  console.log(teamData);
  let processCount = 0;
  return new Promise((resolve, reject) => {
    teamMembers.forEach((member, index, array) => {
      processCount++;
      if (member.email !== localStorage.getItem("email") + ".com") {
        putData(`users/${member.email.slice(0, -4)}/teams/partOf/${teamId}`, {
          ...teamData,
          admin: localStorage.getItem("email"),
        });
      }

      if (processCount === array.length) {
        resolve();
      }
    });
  });
};

// Get Month
export const getMonth = (month) => {
  const MONTHS = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return MONTHS[month];
};

// Chek Member answer answer send or not
export const isMemberAnswerSendToday = (email, data) => {
  for (const answer in data.answers) {
    if (data.answers[answer]) {
      localStorage.setItem(email + "Send", JSON.stringify(data.answers));
    }
  }
};
