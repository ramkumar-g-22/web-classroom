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
import { Menu, MenuItem, Snackbar, TextField } from "@material-ui/core";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import { database, storage } from "../../firebase/firebase";
import { v4 as uuid } from "uuid";
import { useHistory, useParams } from "react-router-dom";
import AddIcon from "@material-ui/icons/Add";
import emailjs from "emailjs-com";
import { useAuth } from "../../context/AuthContext";

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

  textField: {
    width: "200px",
  },
  list: {
    margin: "30px",
    display: "flex",
    flexDirection: "column",
  },
  materialBtn: {
    "&:hover": {
      color: "white",
      backgroundColor: "grey",
    },
  },
  materialLink: {
    marginTop: "1rem",
    textDecoration: "none",
    fontSize: "1.2rem",
    fontWeight: "600",
    "&:hover": {
      textDecoration: "underline",
      // color: "white",
      // backgroundColor: "grey",
    },
  },
  topic: {
    width: "300px",
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Material({ topicList }) {
  const [id, setId] = useState();
  const [file, setFile] = useState();
  const [materialUrl, setMaterialUrl] = useState();
  const [title, setTitle] = useState("");
  const [instruction, setInstruction] = useState("");
  const [topic, setTopic] = useState("No Topic");
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const { teachingClassName } = useParams();
  const currentDate = new Date();
  const [snackOpen, setSnackOpen] = useState(false);
  const { currentUser } = useAuth();
  const history = useHistory();
  const [studentList, setStudentList] = useState();
  const [className, setClassName] = useState();
  const [classCode, setClassCode] = useState();
  const [section, setSection] = useState();
  // const [upload, setUpload] = useState(false);

  // const handleFile = (e) => {
  //   setFile(e.target.files[0]);
  //   // const file = e.target.files[0];
  //   // console.log("file : " + file.name);
  // };
  // console.log(currentUser);

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
    setInstruction("");
    setTitle("");
    setFile("");
  }

  async function handleFile(e) {
    const file = e.target.files[0];
    setFile(() => file);
    const id = uuid();
    setId(() => id);
    // console.log("File : ", file);
    // console.log("Uid : ", id);
    const storageRef = storage
      .ref(teachingClassName)
      .child("/Classwork" + "/" + topic + "/Materials" + "/" + id);
    // await storageRef.put(file);
    // storageRef.getDownloadURL().then((url) => {
    //   setMaterialUrl(() => url);
    // });
    var uploadTask = storageRef.put(file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // console.log(progress);
        console.log("Upload is ", progress, "% done");
      },
      (error) => {
        console.log("Upload Failed : ", error.code);
      },
      (complete) => {
        // setUpload(true);
        storageRef.getDownloadURL().then((url) => {
          setMaterialUrl(() => url);
        });
        setSnackOpen(true);
        console.log("Upload Completed");
      }
    );
    // id &&
    // storageRef.getDownloadURL().then((url) => {
    //   setMaterialUrl(() => url);
    // });
    // console.log("Uid : ", id);
  }

  function handlePost() {
    console.log("File : ", file);
    console.log("Uid : ", id);
    console.log("Material Url : ", materialUrl);
    const teachingClassNameRef = database.ref(teachingClassName);
    const materialsRef = teachingClassNameRef.child(
      "/Classwork" +
        "/Topic Content List" +
        "/" +
        topic +
        "/Materials" +
        "/" +
        id
    );
    const materialAnnouncementRef = teachingClassNameRef.child(
      "/Stream" + "/Announcements"
    );
    const materialInfo = {
      contentType: "Material",
      title,
      instruction,
      topic,
      materialUrl,
      timeStamp: currentDate.toDateString().slice(4, 10),
      fileName: file.name,
      views: 0,
    };
    console.log("File : " + file.name);
    materialsRef.set(materialInfo);
    materialAnnouncementRef.push(materialInfo);

    studentList.map((student) => {
      sendEmail(student.studentEmail, student.studentName);
    });

    setEmpty();
    setOpen(false);
    // setUpload(false);
  }

  // const handlePost = () => {
  //   const id = uuid();
  //   const storageRef = storage
  //     .ref(teachingClassName)
  //     .child("/Classwork" + "/" + topic + "/Materials" + "/" + id);
  //   var uploadTask = storageRef.put(file);
  //   uploadTask.on(
  //     "state_changed",
  //     (snapshot) => {
  //       var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  //       console.log("Upload is " + progress + "% done");
  //       switch (snapshot.state) {
  //         case storage.TaskState.PAUSED: // or 'paused'
  //           console.log("Upload is paused");
  //           break;
  //         case storage.TaskState.RUNNING: // or 'running'
  //           console.log("Upload is running");
  //           break;
  //       }
  //     },
  //     (error) => {
  //       console.log("Upload Failed : " + error.code);
  //     },
  //     (complete) => {
  //       console.log("Upload Completed");
  //     }
  //   );
  //   storageRef.getDownloadURL().then((url) => {
  //     setMaterialUrl(url);
  //     const teachingClassNameRef = database.ref(teachingClassName);
  //     const materialsRef = teachingClassNameRef.child(
  //       "/Classwork" +
  //         "/Topic Content List" +
  //         "/" +
  //         topic +
  //         "/Materials" +
  //         "/" +
  //         id
  //     );
  //     const materialAnnouncementRef = teachingClassNameRef.child(
  //       "/Stream" + "/Announcements"
  //     );
  //     const materialInfo = {
  //       contentType: "Material",
  //       title,
  //       instruction,
  //       topic,
  //       materialUrl: url,
  //       timeStamp: currentDate.toDateString().slice(4, 10),
  //       fileName: file.name,
  //     };
  //     // console.log("File : " + file.name);
  //     materialsRef.set(materialInfo);
  //     materialAnnouncementRef.push(materialInfo);
  //   });
  //   setEmpty();
  //   setOpen(false);
  // };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEmpty();
    setSnackOpen(false);
    // setUpload(false);
  };

  const handleSnackClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackOpen(false);
  };

  return (
    <div>
      <Button
        startIcon={<AddIcon />}
        variant="outlined"
        // color="black"
        className={classes.materialBtn}
        onClick={handleClickOpen}
      >
        Material
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
              Material
            </Typography>
            <Button
              variant="outlined"
              disabled={!(title && topic && file)}
              color="primary"
              onClick={handlePost}
            >
              Post
            </Button>
          </Toolbar>
        </AppBar>
        <List className={classes.list}>
          <TextField
            autoFocus
            onChange={(e) => setTitle(e.target.value)}
            variant="filled"
            // margin="dense"
            id="title"
            label="Title"
            type="text"
            value={title}
            fullWidth
            style={{ marginTop: "1rem" }}
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
          <input
            // accept="image/*"
            className={classes.input}
            id="contained-button-file"
            multiple
            type="file"
            onChange={handleFile}
          />
          <label htmlFor="contained-button-file">
            <Button
              style={{ marginTop: "1rem" }}
              variant="outlined"
              color="black"
              component="span"
              startIcon={<AttachFileIcon />}
              // onClick={handleFile}
            >
              Add
            </Button>
          </label>
          {/* <img src={materialUrl} alt="" /> */}
          {file && materialUrl && (
            <a
              href={materialUrl}
              target="_blank"
              className={classes.materialLink}
            >
              {file.name}
            </a>
          )}
          {/* {upload && ( */}
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
          {/* )} */}
        </List>
      </Dialog>
    </div>
  );
}
