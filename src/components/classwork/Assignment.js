import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import { MenuItem, TextField } from "@material-ui/core";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import { useHistory, useParams } from "react-router-dom";
import { database } from "../../firebase/firebase";
import AddIcon from "@material-ui/icons/Add";
import { useAuth } from "../../context/AuthContext";
import emailjs from "emailjs-com";

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
    backgroundColor: "white",
  },
  title: {
    color: "black",
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  input: {
    display: "none",
  },

  points: {
    width: "300px",
  },
  textField: {
    width: "200px",
  },
  list: {
    margin: "30px",
    display: "flex",
    flexDirection: "column",
  },
  assignmentBtn: {
    "&:hover": {
      color: "white",
      backgroundColor: "grey",
    },
  },
  topic: {
    width: "300px",
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Assignment({ topicList }) {
  const [title, setTitle] = useState("");
  const [instruction, setInstruction] = useState("");
  const [points, setPoints] = useState("");
  const [topic, setTopic] = useState("No Topic");
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const { teachingClassName } = useParams();
  const [dueDate, setDueDate] = useState("");
  const currentDate = new Date();
  const { currentUser } = useAuth();
  const history = useHistory();
  const [studentList, setStudentList] = useState();
  const [className, setClassName] = useState();
  const [classCode, setClassCode] = useState();
  const [section, setSection] = useState();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEmpty();
  };

  const teachingClassNameRef = database.ref(teachingClassName);
  const studentRef = teachingClassNameRef.child("/People" + "/Student List");
  const aboutRef = teachingClassNameRef.child("About");

  function getStudentList() {
    studentRef.on("value", (snapshot) => {
      const studentList = [];
      const students = snapshot.val();
      for (const key in students) {
        const student = students[key];
        studentList.push(student);
      }
      setStudentList(studentList);
    });
  }

  function getClassDetails() {
    aboutRef.on("value", (snapshot) => {
      const about = snapshot.val();
      // console.log("about", about);
      setClassName(() => about.className);
      setClassCode(() => about.classCode);
      setSection(() => about.section);
      console.log(className, section, classCode);
    });
  }

  useEffect(() => {
    getStudentList();
    getClassDetails();
  }, []);

  const SERVICE_ID = "service_gmail";
  const TEMPLATE_ID = "material_template";
  const USER_ID = "user_HDBrQ37Y4hjplMK9qg4NS";

  async function sendEmail(to, toName) {
    const materialTemplateParams = {
      fromName: currentUser.displayName,
      from: currentUser.email,
      to,
      toName,
      title,
      materialUrl:
        "https://web-classroom-45a5b.web.app/" +
        history.location.pathname +
        "/" +
        topic,
      className,
      classCode,
      section,
    };

    await emailjs
      .send(SERVICE_ID, TEMPLATE_ID, materialTemplateParams, USER_ID)
      .then(
        function (response) {
          // console.log("SUCCESS!", response.status, response.text);
          console.log("Email sent to", to);
        },
        function (error) {
          console.log("FAILED...", error);
        }
      );
  }

  function setEmpty() {
    setTitle("");
    setInstruction("");
    setPoints("");
    setDueDate("");
  }

  const handleAssign = () => {
    const teachingClassNameRef = database.ref(teachingClassName);
    const assignmentsRef = teachingClassNameRef.child(
      "/Classwork" + "/Topic Content List" + "/" + topic + "/Assignments"
    );

    const assignmentAnnouncementRef = teachingClassNameRef.child(
      "/Stream" + "/Announcements"
    );

    const assignmentInfo = {
      contentType: "Assignment",
      title,
      instruction,
      topic,
      points,
      dueDate,
    };
    assignmentsRef.push(assignmentInfo);
    assignmentAnnouncementRef.push(assignmentInfo);

    studentList.map((student) => {
      sendEmail(student.studentEmail, student.studentName);
    });

    setEmpty();
    setOpen(false);
  };

  return (
    <div>
      <Button
        startIcon={<AddIcon />}
        variant="outlined"
        // color="black"
        onClick={handleClickOpen}
        className={classes.assignmentBtn}
      >
        Assignment
      </Button>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Assignment
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleAssign}
              disabled={!(title && instruction && points && topic && dueDate)}
            >
              Assign
            </Button>
          </Toolbar>
        </AppBar>
        <List className={classes.list}>
          <TextField
            style={{ marginTop: "1rem" }}
            autoFocus
            onChange={(e) => setTitle(e.target.value)}
            variant="filled"
            // margin="dense"
            id="title"
            label="Title"
            type="text"
            value={title}
            fullWidth
          />
          <TextField
            style={{ marginTop: "1rem" }}
            className={classes.instruction}
            multiline
            rows={4}
            onChange={(e) => setInstruction(e.target.value)}
            variant="filled"
            margin="dense"
            id="instruction"
            label="Instructions"
            type="text"
            value={instruction}
            fullWidth
          />
          <TextField
            style={{ marginTop: "1rem" }}
            className={classes.points}
            onChange={(e) => setPoints(e.target.value)}
            variant="filled"
            margin="dense"
            id="points"
            label="Points"
            type="number"
            value={points}
          />
          <TextField
            style={{ marginTop: "1rem" }}
            id="standard-select-topic"
            select
            label="Topic"
            value={topic}
            variant="filled"
            onChange={(e) => setTopic(e.target.value)}
            className={classes.topic}
            // helperText="Please select topic"
          >
            <MenuItem value="No Topic">No Topic</MenuItem>
            <Divider />
            {topicList &&
              topicList.map((topic, index) => (
                <MenuItem key={index} value={topic}>
                  {topic}
                </MenuItem>
              ))}
          </TextField>
          <TextField
            style={{ marginTop: "1rem" }}
            id="date"
            label="Due Date"
            type="date"
            onChange={(e) => setDueDate(e.target.value)}
            value={dueDate}
            className={classes.textField}
            InputLabelProps={{
              shrink: true,
            }}
          />
          {/* <input
            accept="image/*"
            className={classes.input}
            id="contained-button-file"
            multiple
            type="file"
          />
          <label htmlFor="contained-button-file">
            <Button
              variant="outlined"
              color="black"
              component="span"
              startIcon={<AttachFileIcon />}
            >
              Add
            </Button>
          </label> */}
        </List>
      </Dialog>
    </div>
  );
}
