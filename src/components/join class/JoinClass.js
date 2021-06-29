import React, { useEffect, useState } from "react";
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
// import { useAuth } from "../../context/AuthContext";

const useStyles = makeStyles((theme) => ({
  joinClassBtn: {
    color: "white",
    fontWeight: "bold",
    marginRight: "30px",
    // textTransform: "none",
  },
}));

export default function JoinClass() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [classCode, setClassCode] = useState("");
  const [teacherUid, setTeacherUid] = useState();
  const { currentUser } = useAuth();
  const [classCodeDetailList, setClassCodeDetailList] = useState([]);
  const history = useHistory();
  // const [snackOpen, setSnackOpen] = useState(false);

  var userInfoRef = database.ref("User Info");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    getClassCodeDetails();
    // getStudentList();
  }, []);

  function getClassCodeDetails() {
    const classCodeDetailsRef = database.ref("Class Code");
    classCodeDetailsRef.on("value", (snapshot) => {
      const classCodeDetailList = [];
      // snapshot.forEach((element) => {
      //   classCodes.push(element.val());
      //   // console.log(element.key);
      //   // console.log(element.val());
      // });
      const classCodeDetails = snapshot.val();
      for (const key in classCodeDetails) {
        const classCodeDetail = classCodeDetails[key];
        classCodeDetailList.push(classCodeDetail);
        // console.log("classCodeDetail : " + classCodeDetail.classCode);
        // console.log("classCodeDetail : " + classCodeDetail.teacherUid);
      }
      setClassCodeDetailList(classCodeDetailList);
    });
  }

  const handleJoinClass = () => {
    var enrolledClassesRef = userInfoRef.child(
      "Enrolled Classes/" + currentUser.uid + "/" + classCode
    );
    classCodeDetailList.map((classCodeDetail) => {
      if (classCode === classCodeDetail.classCode) {
        if (classCodeDetail.teacherUid === currentUser.uid) {
          console.log("You're the faculty of this class");
          setOpen(true);
          // setSnackOpen(true);
          return;
        }
        setTeacherUid(classCodeDetail.teacherUid);
        var teachingClassesRef = userInfoRef.child(
          "Teaching Classes/" + classCodeDetail.teacherUid
        );
        teachingClassesRef
          .child(`${classCodeDetail.classCode}`)
          .on("value", (snap) => {
            const className = snap.val().className;
            // console.log("Class : " + Class);
            const joiningClassNameRef = database.ref(className);
            const studentDetails = {
              studentName: currentUser.displayName,
              studentProfile: currentUser.photoURL,
              studentUid: currentUser.uid,
              studentEmail: currentUser.email,
            };
            const studentRef = joiningClassNameRef.child(
              "/People" + "/Student List" + "/" + currentUser.uid
            );
            studentRef.set(studentDetails);
            const joinClass = {
              userName: snap.val().userName,
              userProfile: snap.val().userProfile,
              // className: snap.val().className,
              className,
              section: snap.val().section,
              subject: snap.val().subject,
              room: snap.val().room,
              classCode: snap.val().classCode,
            };
            // console.log(joinClass);
            enrolledClassesRef.set(joinClass);
          });
        history.push("/");
        console.log("Matching : " + classCode);
      } else {
        console.log("Class Code doestn't exist : " + classCode);
      }
    });
    setOpen(false);
    setClassCode("");
  };

  return (
    <div>
      <Button
        variant="text"
        className={classes.joinClassBtn}
        onClick={handleClickOpen}
      >
        JoinClass
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Join Class</DialogTitle>
        <DialogContent>
          <DialogContentText variant="h6">Class Code</DialogContentText>
          <DialogContentText>
            Ask your teacher for the class code, then enter it here.
          </DialogContentText>
          <TextField
            id="outlined-secondary"
            label="Class Code"
            variant="outlined"
            color="primary"
            value={classCode}
            onChange={(e) => setClassCode(e.target.value)}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleJoinClass}
            disabled={classCode.length > 6 || classCode.length < 6}
            color="primary"
          >
            Join
          </Button>
          {/* <Snackbar
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            open={snackOpen}
            autoHideDuration={6000}
            // onClose={handleSnackClose}
            message="File Uploaded"
          /> */}
        </DialogActions>
      </Dialog>
    </div>
  );
}
