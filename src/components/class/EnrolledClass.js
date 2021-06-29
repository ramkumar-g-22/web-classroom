import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { database } from "../../firebase/firebase";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {
  Avatar,
  Card,
  CardHeader,
  CardMedia,
  CssBaseline,
  IconButton,
  Typography,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  headerClassName: {
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap",
    color: "white",
    fontSize: "20px",
    fontWeight: "bold",
  },
  headerSection: {
    color: "white",
    fontSize: "16px",
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap",
  },
  headerUserName: {
    color: "white",
    fontSize: "16px",
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap",
  },
  link: {
    textDecoration: "none",
  },
  enrolledClass: {
    height: "190px",
    border: "0.5px solid grey",
    width: "290px",
    margin: "15px",
    borderRadius: "7px",
    position: "relative",
  },
  classNameAndUserName: {
    // backgroundColor: "#9c9594",
    backgroundColor: "#009688",
    padding: "5px",
    // display: "flex",
    height: "90px",
    listStyleType: "none",
  },
  teacherProfile: {
    // height: 0,
    position: "absolute",
    borderRadius: "50%",
    width: "65px",
    margin: "auto",
    top: "60px",
    right: "10px",
  },
}));

function EnrolledClass() {
  const classes = useStyles();
  const { currentUser } = useAuth();
  const [classInfo, setClassInfo] = useState([]);

  useEffect(() => {
    var userInfoRef = database.ref("User Info");
    var enrolledClassesRef = userInfoRef.child(
      "Enrolled Classes/" + currentUser.uid
    );
    enrolledClassesRef.on("value", (snapshot) => {
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
      <div className={classes.enrolledClass}>
        <Link to={`${code.className}/stream`} className={classes.link}>
          <Card className={classes.classNameAndUserName}>
            <Typography className={classes.headerClassName}>
              {code.className}
            </Typography>
            <Typography className={classes.headerSection} gutterBottom>
              {code.section}
            </Typography>
            <Typography
              // component="h3"
              className={classes.headerUserName}
            >
              {code.userName}
            </Typography>
          </Card>
          <img src={code.userProfile} className={classes.teacherProfile} />
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

export default EnrolledClass;
