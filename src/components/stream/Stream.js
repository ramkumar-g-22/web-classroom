import React, { useEffect, useState } from "react";
import TeachingClassroom from "../TeachingClassroom";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { database, storage } from "../../firebase/firebase";
import Announcements from "./Announcements";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Snackbar, TextField } from "@material-ui/core";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import { v4 as uuid } from "uuid";
import { NavAppBar } from "../App";

const useStyles = makeStyles((theme) => ({
  classInfo: {
    width: "75%",
    height: "200px",
    backgroundColor: "#607d8b",
    color: "white",
    marginTop: "20px",
    // marginBottom: "30px",
    margin: "auto",
    borderRadius: "8px",
  },

  classNames: {
    fontSize: "2rem",
    marginLeft: "20px",
    paddingTop: "10px",
    fontWeight: "bold",
  },
  section: {
    fontSize: "1.5rem",
    marginLeft: "20px",
    fontWeight: "bold",
  },
  classCode: {
    fontSize: "15px",
    marginLeft: "20px",
    fontWeight: "bold",
    paddingTop: "10px",
  },
  inputFile: {
    display: "none",
  },
  announce: {
    width: "75%",
    marginTop: "2rem",
    margin: "auto",
  },
  announceTextField: {
    width: "100%",
    margin: "auto",
  },
  addAndFileLink: {
    // backgroundColor: "#c3c3c3",
    // marginTop: "1rem",
    // width: "100%",
    display: "flex",
    // justifyContent: "flex-end",
  },
  addFileAndPostCancelBtn: {
    marginTop: "1rem",
    // width: "100%",
    // height: "100%",
    display: "flex",
    justifyContent: "space-between",
  },
  postBtn: {
    marginLeft: "1rem",
    width: "6rem",
  },
  postAndCancelBtn: {
    // width: "100%",
    // height: "100%",
    display: "flex",
  },
  // addBtn: {
  //   // marginLeft: "1.4rem",
  // },

  materialLink: {
    marginLeft: "1rem",
    marginTop: "0.4rem",
    textDecoration: "none",
    fontSize: "1.2rem",
    fontWeight: "600",
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap",
    width: "80%",
    "&:hover": {
      textDecoration: "underline",
      // borderBottom: "2px solid blue",
      // color: "white",
      // backgroundColor: "grey",
    },
  },
}));

function Stream() {
  const [id, setId] = useState();
  const [file, setFile] = useState();
  const [materialUrl, setMaterialUrl] = useState();

  const classes = useStyles();
  const [value, setValue] = useState("");
  const { teachingClassName } = useParams();
  const [classCode, setClassCode] = useState("");
  const [className, setClassName] = useState("");
  const [section, setSection] = useState("");
  const [room, setRoom] = useState("");
  const [userName, setUserName] = useState("");
  const [userProfile, setUserProfile] = useState("");
  const [subject, setSubject] = useState("");
  const teachingClassNameRef = database.ref(teachingClassName);
  const aboutClassRef = teachingClassNameRef.child("/About");
  const [snackOpen, setSnackOpen] = useState(false);

  const { currentUser } = useAuth();
  const currentDate = new Date();

  useEffect(() => {
    getClassInfo();
  }, []);

  function getClassInfo() {
    aboutClassRef.on("value", (snapshot) => {
      const classInfo = snapshot.val();
      for (const key in classInfo) {
        setClassCode(classInfo.classCode);
        setClassName(classInfo.className);
        setRoom(classInfo.room);
        setSection(classInfo.section);
        setSubject(classInfo.subject);
        setUserName(classInfo.userName);
        setUserProfile(classInfo.userProfile);
      }
      // console.log("Class Code : " + classCode);
      // console.log("Class Name: " + className);
      // console.log("Class room : " + room);
      // console.log("Class section : " + section);
      // console.log("Class subject : " + subject);
      // console.log("Class userName : " + userName);
      // setClassInfo(snapshot.val());
      // console.log("About : " + about.className);
    });
  }

  const handleSnackClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackOpen(false);
  };

  // console.log(currentDate.toLocaleString());
  // console.log(currentDate.toLocaleDateString());
  // console.log(currentDate.toLocaleTimeString());
  // console.log(currentDate.toDateString().slice(4, 10));

  const handleSubmit = (e) => {
    e.preventDefault();
    const teachingClassNameRef = database.ref(teachingClassName);
    const announcementRef = teachingClassNameRef.child(
      "/Stream" + "/Announcements"
    );
    const announcement = {
      userName: currentUser.displayName,
      photoUrl: currentUser.photoURL,
      timeStamp: currentDate.toDateString().slice(4, 10),
      text: value,
    };
    // firebase.firestore.FieldValue.serverTimestamp();
    !file && announcementRef.push(announcement);
    if (file) {
      const announcementWithFile = {
        userName: currentUser.displayName,
        photoUrl: currentUser.photoURL,
        text: value,
        materialUrl,
        timeStamp: currentDate.toDateString().slice(4, 10),
        fileName: file.name,
      };
      file && announcementRef.push(announcementWithFile);
    }
    setFile("");
    setValue("");
    setId("");
  };

  function handleFile(e) {
    const file = e.target.files[0];
    setFile(() => file);
    const id = uuid();
    setId(() => id);
    const storageRef = storage
      .ref(teachingClassName)
      .child("/Stream" + "/Announcements" + "/" + id);
    var uploadTask = storageRef.put(file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is ", progress, "% done");
      },
      (error) => {
        console.log("Upload Failed : ", error.code);
      },
      (complete) => {
        storageRef.getDownloadURL().then((url) => {
          setMaterialUrl(() => url);
        });
        setSnackOpen(true);
        console.log("Upload Completed");
      }
    );
  }

  return (
    <div>
      <TeachingClassroom />
      <div className={classes.classInfo}>
        <div className={classes.classNames}>{className}</div>
        <div className={classes.section}>{section}</div>
        <div className={classes.classCode}>Class Code : {classCode}</div>
      </div>
      <div className={classes.announce}>
        <form onSubmit={(e) => handleSubmit(e)}>
          <TextField
            multiline
            rows={3}
            variant="filled"
            margin="normal"
            label="Announce something to your class"
            value={value}
            className={classes.announceTextField}
            onChange={(e) => setValue(e.target.value)}
          ></TextField>
          <div className={classes.addFileAndPostCancelBtn}>
            <div className={classes.addAndFileLink}>
              <input
                // accept="image/*"
                className={classes.inputFile}
                id="contained-button-file"
                multiple
                type="file"
                onChange={handleFile}
              />
              <label htmlFor="contained-button-file">
                <Button
                  variant="outlined"
                  // color="black"
                  component="span"
                  startIcon={<AttachFileIcon />}
                  className={classes.addBtn}
                >
                  Add
                </Button>
              </label>
              {file && materialUrl && (
                <a
                  href={materialUrl}
                  target="_blank"
                  className={classes.materialLink}
                >
                  {file.name}
                </a>
              )}
            </div>
            <div className={classes.postAndCancelBtn}>
              <Button
                className={classes.cancelBtn}
                color="primary"
                variant="outlined"
                onClick={() => {
                  setFile("");
                  setValue("");
                }}
              >
                Cancel
              </Button>
              <Button
                className={classes.postBtn}
                color="primary"
                variant="contained"
                onClick={(e) => handleSubmit(e)}
                disabled={!value}
              >
                Post
              </Button>
              <Snackbar
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                open={snackOpen}
                autoHideDuration={6000}
                onClose={handleSnackClose}
                message="File Uploaded"
              />
            </div>
          </div>
        </form>
      </div>
      <Announcements />
    </div>
  );
}

export default Stream;
