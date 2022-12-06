import { useContext, useState } from "react";
import { Card, Button } from "antd";
import { BiLogOut } from "react-icons/bi";
import classes from "./css/Teams.module.css";
import Team from "./Team";
import CreateTeam from "./CreateTeam";
import { ContextProvider } from "../../context/context";
import LoadingSpinner from "../../UI/LoadingSpinner";
import { useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../../context/context";

const Teams = () => {
  const { logout, loadingSpinnerIsVisible, setLoadingSpinnerIsVisible } =
    useContext(ContextProvider);
  const [teams, setTeams] = useState([]);
  const [partOfTeams, setPartOfTeams] = useState([]);

  const logoutHandler = () => {
    localStorage.clear();
    logout();
  };

  useEffect(() => {
    setLoadingSpinnerIsVisible(true);
    const myEmail = localStorage.getItem("email");
    onValue(ref(database, `users/${myEmail}/teams/own`), (snapshot) => {
      const helpersTeam = [];
      for (const team in snapshot.val()) {
        helpersTeam.push(snapshot.val()[team]);
      }
      setTeams(helpersTeam);
    });
  }, [setLoadingSpinnerIsVisible]);

  useEffect(() => {
    const myEmail = localStorage.getItem("email");
    onValue(ref(database, `users/${myEmail}/teams/partOf`), (snapshot) => {
      const helpersTeam = [];
      for (const team in snapshot.val()) {
        helpersTeam.push(snapshot.val()[team]);
      }
      setPartOfTeams(helpersTeam);
      setLoadingSpinnerIsVisible(false);
    });
  }, [setLoadingSpinnerIsVisible]);

  return (
    <>
      <Card title="Teams" bordered={false} className={classes.parentCard}>
        {loadingSpinnerIsVisible ? (
          <LoadingSpinner />
        ) : (
          <>
            <Button
              type="primary"
              className={classes.logoutBtn}
              onClick={logoutHandler}
              icon={<BiLogOut size="18" />}
            >
              &nbsp;Logout
            </Button>
            <h2>Teams you own</h2>
            {teams.map((team) => (
              <Team
                members={team.members}
                title={team.teamName}
                key={Math.random()}
                ownTeam={true}
                id={team.id}
              />
            ))}
            <h2>Teams you're part of</h2>
            {partOfTeams.map((team) => (
              <Team
                members={team.members}
                title={team.teamName}
                key={Math.random()}
                id={team.id}
              />
            ))}
          </>
        )}
      </Card>

      <CreateTeam />
    </>
  );
};

export default Teams;
