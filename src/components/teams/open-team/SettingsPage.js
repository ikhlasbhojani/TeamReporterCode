import { Input, Button } from "antd";
import { useContext } from "react";
import LoadingSpinner from "../../../UI/LoadingSpinner";
import {
  AiOutlineUserAdd,
  AiOutlineSave,
  AiOutlineClose,
} from "react-icons/ai";
import { FaRegTrashAlt } from "react-icons/fa";
import Member from "./Member";
import classes from "./css/SettingsPage.module.css";
import { SettingsContextProvider } from "../../../context/settingsContext";

const SettingsPage = () => {
  const {
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
  } = useContext(SettingsContextProvider);

  return loadingSpinner ? (
    <LoadingSpinner />
  ) : (
    <div className={classes.settingsContainer}>
      <h3>Questions:</h3>
      <ul className={classes.list}>
        <li className={classes.listItem}>
          <Input
            placeholder="Write....."
            bordered={false}
            className={classes.input}
            onChange={(e) => setQuestion1(e.target.value)}
            value={question1}
          />
        </li>
        <li className={classes.listItem}>
          <Input
            placeholder="Write....."
            bordered={false}
            className={classes.input}
            onChange={(e) => setQuestion2(e.target.value)}
            value={question2}
          />
        </li>
        <li className={classes.listItem}>
          <Input
            placeholder="Write....."
            bordered={false}
            className={classes.input}
            onChange={(e) => setQuestion3(e.target.value)}
            value={question3}
          />
        </li>
      </ul>

      <h3 className={classes.heading}>Members:</h3>
      <ul className={classes.membersContainer}>
        {teamMembers.map((e) => (
          <Member
            key={Math.random()}
            clickHandler={deleteUserHandler}
            email={e.email}
          >
            {e.email}
          </Member>
        ))}
      </ul>

      <div className={classes.addMemberContainer}>
        <div className={classes.listItem}>
          <Input
            placeholder="Add Member"
            bordered={false}
            onChange={(event) => setEmailVal(event.target.value)}
            value={emailVal}
            className={classes.input}
          />
        </div>
        <Button
          type="primary"
          icon={<AiOutlineUserAdd />}
          onClick={addUserHandler}
        >
          &nbsp; Add
        </Button>
      </div>
      <div className={classes.btnContainer}>
        <Button
          type="primary"
          icon={<AiOutlineSave />}
          className={classes.btn}
          onClick={saveChangesHandler}
        >
          &nbsp; Save Changes
        </Button>
        <Button
          className={classes.btn}
          icon={<AiOutlineClose />}
          onClick={cancleHandler}
        >
          &nbsp;Cancle
        </Button>
        <Button
          type="danger"
          className={`${classes.btn} ${classes.btnDanger}`}
          icon={<FaRegTrashAlt />}
          onClick={deleteTeamHandler}
        >
          &nbsp; Delete Team
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;
