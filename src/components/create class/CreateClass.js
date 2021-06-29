import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { database } from "../../firebase/firebase";
import { useAuth } from "../../context/AuthContext";
import { makeStyles } from "@material-ui/core";
import { useHistory } from "react-router";

const useStyles = makeStyles((theme) => ({
  createClassBtn: {
    color: "white",
    fontWeight: "bold",
    marginRight: "30px",
    // textTransform: "none",
  },
}));

function generateClassCode() {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let index = 0; index < 6; index++) {
    result += characters.charAt(Math.floor(Math.random() * 61));
  }
  console.log("Code : ", result);
  return result;
}

export default function CreateClass() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [className, setClassName] = useState("");
  const [section, setSection] = useState("");
  const [subject, setSubject] = useState("");
  const [room, setRoom] = useState("");
  const { currentUser } = useAuth();
  const history = useHistory();

  const handleCreateClass = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEmpty();
  };

  const setEmpty = () => {
    setClassName("");
    setSection("");
    setSubject("");
    setRoom("");
  };

  const handleCreate = () => {
    const classCode = generateClassCode();
    const teachingClassNameRef = database.ref(className);
    const teacherDetails = {
      teacherName: currentUser.displayName,
      teacherProfile: currentUser.photoURL,
      teacherUid: currentUser.uid,
    };
    const teacherRef = teachingClassNameRef.child("/People" + "/Teacher List");
    const aboutClassRef = teachingClassNameRef.child("/About");
    teacherRef.push(teacherDetails);
    var userInfoRef = database.ref("User Info");
    var teachingClassesRef = userInfoRef.child(
      "Teaching Classes/" + currentUser.uid + "/" + classCode
    );
    var classCodeRef = database.ref("Class Code");
    const createClass = {
      userName: currentUser.displayName,
      userProfile: currentUser.photoURL,
      className,
      section,
      subject,
      room,
      classCode,
    };
    // teachingClassesRef.push(createClass);
    teachingClassesRef.set(createClass);
    aboutClassRef.set(createClass);
    const classCodeDetails = {
      classCode,
      teacherUid: currentUser.uid,
    };
    classCodeRef.push(classCodeDetails);
    setOpen(false);
    setEmpty();
    history.push("/");
  };

  return (
    <div>
      <Button
        variant="text"
        className={classes.createClassBtn}
        onClick={handleCreateClass}
      >
        CreateClass
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Create Class</DialogTitle>
        <DialogContent>
          {/* <DialogContentText>
            To subscribe to this website, please enter your email address here.
            We will send updates occasionally.
          </DialogContentText> */}
          <TextField
            autoFocus
            onChange={(e) => setClassName(e.target.value)}
            variant="filled"
            margin="dense"
            id="classname"
            label="Class Name"
            type="text"
            value={className}
            fullWidth
            required
          />
          <TextField
            required
            value={section}
            onChange={(e) => setSection(e.target.value)}
            variant="filled"
            margin="dense"
            id="section"
            label="Section"
            type="text"
            fullWidth
          />
          <TextField
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            variant="filled"
            margin="dense"
            id="room"
            label="Room"
            type="text"
            fullWidth
          />
          <TextField
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            variant="filled"
            margin="dense"
            id="subject"
            label="Subject"
            type="text"
            fullWidth
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            color="primary"
            disabled={!(className && section)}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
