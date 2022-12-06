import { useContext } from "react";
import { ContextProvider } from "../../context/context";
import { Card } from "antd";
import classes from ".//css/Team.module.css";
import { useNavigate } from "react-router-dom";

const Team = ({ members, title, ownTeam, id }) => {
  const { setTeamId } = useContext(ContextProvider);
  const navigate = useNavigate();

  const openTeamHandler = () => {
    setTeamId(id);
    ownTeam ? navigate("/openTeam") : navigate("/memberPage");
  };

  if (!ownTeam) {
    members = members.filter(
      (member) => member.email !== localStorage.getItem("email") + ".com"
    );

    members.unshift({
      name: "You",
      email: localStorage.getItem("email") + ".com",
    });
  }

  return (
    <div>
      <Card className={classes.team} onClick={openTeamHandler}>
        <h4>{title}</h4>
        {members ? (
          members.length > 2 ? (
            <p>
              <b>Members: </b>
              <span>{members[0].name}</span>, <span>{members[1].name}</span> &{" "}
              {members.length - 2}{" "}
              {members.length >= 3 ? <span> other</span> : <span> others</span>}
            </p>
          ) : (
            <p>
              <b>Members: </b>{" "}
              {members.length === 1 ? (
                <span>{members[0].name}</span>
              ) : (
                <>
                  {" "}
                  <span>{members[0].name}</span>, <span>{members[1].name}</span>{" "}
                </>
              )}
            </p>
          )
        ) : (
          ""
        )}
      </Card>
    </div>
  );
};

export default Team;
