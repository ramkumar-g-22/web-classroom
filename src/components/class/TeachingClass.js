import React, { useEffect, useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { database } from "../../firebase/firebase";
import { makeStyles } from "@material-ui/core/styles";
import {
  Avatar,
  Card,
  CardHeader,
  CssBaseline,
  IconButton,
  Typography,
} from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";

const useStyles = makeStyles((theme) => ({
  headerClassName: {
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap",
    color: "white",
    fontSize: "20px",
    fontWeight: "bold",
    // padding: "6px",
  },
  headerSection: {
    // padding: "6px",
    color: "white",
    fontSize: "16px",
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap",
  },
  link: {
    textDecoration: "none",
  },
  teachingClass: {
    height: "190px",
    border: "0.5px solid grey",
    width: "290px",
    margin: "15px",
    borderRadius: "7px",
  },
  classNameAndSection: {
    backgroundColor: "#607d8b",
    padding: "5px",
    // display: "flex",
    height: "90px",
    listStyleType: "none",
  },
}));

function TeachingClass() {
  const classes = useStyles();
  const { currentUser } = useAuth();
  const [classInfo, setClassInfo] = useState([]);

  useEffect(() => {
    var userInfoRef = database.ref("User Info");
    var teachingClassesRef = userInfoRef.child(
      "Teaching Classes/" + currentUser.uid
    );
    teachingClassesRef.on("value", (snapshot) => {
      const classInformations = snapshot.val();
      const classInfo = [];
      for (let key in classInformations) {
        classInfo.push(classInformations[key]);
        // console.log("Key : ", key);
      }
      //   console.log(classInfo);
      setClassInfo(classInfo);
    });
  }, []);

  const Class = ({ code }) => {
    return (
      <div className={classes.teachingClass}>
        <Link to={`${code.className}/stream`} className={classes.link}>
          <Card className={classes.classNameAndSection}>
            <Typography className={classes.headerClassName} gutterBottom>
              {code.className}
            </Typography>
            <Typography className={classes.headerSection}>
              {code.section}
            </Typography>
          </Card>
        </Link>
      </div>
    );
  };

  return (
    <div
      // style={{
      //   display: "grid",
      //   gridTemplateColumns: "auto auto auto auto",
      // }}
      style={{
        display: "flex",
      }}
    >
      {classInfo
        ? classInfo.map((code) => <Class code={code} key={code.classCode} />)
        : ""}
    </div>
  );
}

export default TeachingClass;
