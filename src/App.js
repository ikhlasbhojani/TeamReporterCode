import { Layout } from "antd";
import React, { useEffect, useState } from "react";
import { firbaseAuth } from "./context/context";
import { onAuthStateChanged } from "firebase/auth";
import "./App.css";
import SignIn from "./components/auth/SignIn";
import SignUp from "./components/auth/SignUp";
import { Routes, Route, useNavigate } from "react-router-dom";
import Teams from "./components/teams/Teams";
import OpenTeam from "./components/teams/open-team/OpenTeam";
import LoadingSpinner from "./UI/LoadingSpinner";
import MemberPage from "./components/teams/open-team/MemberPage";

const App = () => {
  let [userIsLoggedInn, setUserIsLoggedInn] = useState(false);
  let [loadingSpinnerIsVisible, setLoadingSpinnerIsVisible] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (window.performance) {
      if (performance.navigation.type === 1) {
        navigate("/");
      }
    }
  }, []);

  useEffect(() => {
    onAuthStateChanged(firbaseAuth, (user) => {
      if (user) {
        setUserIsLoggedInn(true);
      } else {
        setUserIsLoggedInn(false);
      }
      setLoadingSpinnerIsVisible(false);
    });
  }, []);

  return loadingSpinnerIsVisible ? (
    <LoadingSpinner />
  ) : (
    <Layout className="layout">
      <Routes>
        {!userIsLoggedInn && <Route path="/" element={<SignIn />} />}
        {!userIsLoggedInn && <Route path="sign-up" element={<SignUp />} />}
        {userIsLoggedInn && <Route path="teams" element={<Teams />} />}
        {userIsLoggedInn && <Route path="*" element={<Teams />} />}
        {!userIsLoggedInn && <Route path="*" element={<SignIn />} />}
        {userIsLoggedInn && <Route path="openTeam" element={<OpenTeam />} />}
        {userIsLoggedInn && (
          <Route path="memberPage" element={<MemberPage />} />
        )}
      </Routes>
    </Layout>
  );
};

export default App;
