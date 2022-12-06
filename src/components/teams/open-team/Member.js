import { FaRegTimesCircle } from "react-icons/fa";
import classes from "./css/Member.module.css";

const Member = ({ children, clickHandler, email }) => {
  return (
    <li className={classes.memberItem}>
      {children}{" "}
      <FaRegTimesCircle
        size="20"
        className={classes.memberIcon}
        onClick={clickHandler.bind(null, email)}
      />
    </li>
  );
};

export default Member;
