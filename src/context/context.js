import { createContext, useState } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { getDatabase, set, ref } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDlv_RKGKsyN-AAwaDJTyQI-bIuCpnQB70",
  authDomain: "teamapp-e0f8f.firebaseapp.com",
  databaseURL: "https://teamapp-e0f8f-default-rtdb.firebaseio.com",
  projectId: "teamapp-e0f8f",
  storageBucket: "teamapp-e0f8f.appspot.com",
  messagingSenderId: "485922528874",
  appId: "1:485922528874:web:90dea8eae170807dcb7413",
};

const firbaseApp = initializeApp(firebaseConfig);
export const firbaseAuth = getAuth(firbaseApp);
export const database = getDatabase(firbaseApp);

export const ContextProvider = createContext({
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
  isVisible: false,
  setIsVisible: null,
  newTeam: null,
  setNewTeam: null,
  loadingSpinnerIsVisible: false,
  setLoadingSpinnerIsVisible: null,
  signUpUserWithEmailAndPassword: null,
  signInUserWithEmailAndPassword: null,
  putData: null,
  teamId: null,
  setTeamId: null,
});

const Context = (props) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [newTeam, setNewTeam] = useState(0);
  const [loadingSpinnerIsVisible, setLoadingSpinnerIsVisible] = useState(false);
  const [teamId, setTeamId] = useState(null);

  const loginHandler = () => {
    setIsLoggedIn(true);
  };

  const logoutHandler = () => {
    setIsLoggedIn(false);
    signOut(firbaseAuth);
  };

  const signUpUserWithEmailAndPassword = (email, password) => {
    return createUserWithEmailAndPassword(firbaseAuth, email, password);
  };

  const signInUserWithEmailAndPassword = (email, password) => {
    return signInWithEmailAndPassword(firbaseAuth, email, password);
  };

  const putData = (key, data) => set(ref(database, key), data);

  const contextValue = {
    isLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
    isVisible,
    setIsVisible,
    newTeam,
    setNewTeam,
    loadingSpinnerIsVisible,
    setLoadingSpinnerIsVisible,
    signUpUserWithEmailAndPassword,
    signInUserWithEmailAndPassword,
    putData,
    teamId,
    setTeamId,
  };

  return (
    <ContextProvider.Provider value={contextValue}>
      {props.children}
    </ContextProvider.Provider>
  );
};

export default Context;
