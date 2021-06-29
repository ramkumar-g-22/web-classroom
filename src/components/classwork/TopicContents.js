import React, { useEffect, useState } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { database } from "../../firebase/firebase";
import TeachingClassroom from "../TeachingClassroom";
import Topics from "./Topics";
import assignmentImg from "../../assets/assignment.png";
import materialImg from "../../assets/material.png";
import questionImg from "../../assets/question.png";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  TextField,
} from "@material-ui/core";
import AttachFileIcon from "@material-ui/icons/AttachFile";

const useStyles = makeStyles((theme) => ({
  topicName: {
    fontSize: "2rem",
    fontWeight: "400",
    color: "#202124",
    // marginLeft: "1.1rem",
  },
  topicContents: {
    margin: "auto",
    width: "55%",
    marginTop: "2rem",
  },
  question: {
    border: "0.0625rem solid #bdbdbd",
    borderRadius: "5px",
    marginTop: "2rem",
    marginBottom: "2rem",
  },
  questionNameAndDue: {
    // backgroundColor: "#d3e3dc",
    display: "flex",
    width: "100%",
    borderBottom: "0.0625rem solid #bdbdbd",
    marginBottom: "1rem",
    // margin: "1rem 1rem",
  },
  questionInfo: {
    // backgroundColor: "grey",
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    marginTop: "1rem",
    // margin: "1rem",
  },
  questionImage: {
    width: "2.5rem",
    borderRadius: "50%",
    border: "1px solid grey",
    marginLeft: "1rem",
    marginTop: "1rem",
    marginBottom: "1rem",
  },
  questionTitle: {
    marginTop: "0.5rem",
    marginLeft: "1rem",
    color: "#3c4043",
    fontSize: "1rem",
    fontWeight: "600",
  },
  questionTimeStamp: {
    marginTop: "0.5rem",
    color: "rgba(0,0,0,0.549)",
    fontSize: "0.875rem",
    fontWeight: "500",
    marginRight: "1rem",
  },

  questionTeacher: {
    display: "flex",
    justifyContent: "space-between",
    margin: "1rem",
  },

  questionTurnedInCount: {
    fontSize: "2rem",
    fontWeight: "400",
    color: "#3c4043",
  },
  questionTurnedInAndCount: {
    borderLeft: ".0625rem solid #bdbdbd",
    padding: "0 1rem",
  },
  questionInstruction: {
    fontSize: "1rem",
    marginTop: "2.5%",
    marginLeft: "5%",
  },
  questionStudent: {
    // backgroundColor: "#d3e3dc",
    width: "100%",
  },
  questionTurnInBtn: {
    borderRadius: "0.3rem",
    marginTop: ".5rem",
    marginBottom: "1rem",
  },
  questionTurnInBtnContainer: {
    display: "flex",
    justifyContent: "flex-end",
    // flexDirection: "column",
  },
  questionForm: {
    margin: "1rem 5%",
    // backgroundColor: "#d3e3dc",
    width: "90%",
  },

  assignment: {
    // backgroundColor: "#d3e3dc",
    border: "0.0625rem solid #bdbdbd",
    borderRadius: "5px",
    marginTop: "2rem",
    marginBottom: "2rem",
  },
  assignmentNameAndDue: {
    // backgroundColor: "#d3e3dc",
    display: "flex",
    width: "100%",
    borderBottom: "0.0625rem solid #bdbdbd",
    marginBottom: "1rem",
    // margin: "1rem 1rem",
  },
  assignmentInfo: {
    // backgroundColor: "grey",
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    marginTop: "1rem",
    // margin: "1rem",
  },
  assignmentImage: {
    width: "2.5rem",
    borderRadius: "50%",
    border: "1px solid grey",
    marginLeft: "1rem",
    marginTop: "1rem",
    marginBottom: "1rem",
  },
  assignmentTitle: {
    marginTop: "0.5rem",
    marginLeft: "1rem",
    color: "#3c4043",
    fontSize: "1rem",
    fontWeight: "600",
  },
  assignmentTimeStamp: {
    marginTop: "0.5rem",
    color: "rgba(0,0,0,0.549)",
    fontSize: "0.875rem",
    fontWeight: "500",
    marginRight: "1rem",
  },

  assignmentTeacher: {
    display: "flex",
    justifyContent: "space-between",
    margin: "1rem",
  },

  assignmentTurnedInCount: {
    fontSize: "2rem",
    fontWeight: "400",
    color: "#3c4043",
  },
  assignmentTurnedInAndCount: {
    borderLeft: ".0625rem solid #bdbdbd",
    padding: "0 1rem",
  },
  assignmentInstruction: {
    fontSize: "1rem",
    marginTop: "2.5%",
    marginLeft: "5%",
  },
  assignmentStudent: {
    // backgroundColor: "#d3e3dc",
    width: "100%",
  },
  assignmentTurnInBtn: {
    borderRadius: "0.3rem",
  },
  assignmentTurnInBtnContainer: {
    justifyContent: "flex-end",
    display: "flex",
    // flexDirection: "column",
  },
  assignmentForm: {
    margin: "1rem 5%",
    display: "flex",
    justifyContent: "space-between",
    // flexDirection: "column",
    // backgroundColor: "#d3e3dc",
    // width: "90%",
  },
  assignmentInputFile: {
    display: "none",
  },

  material: {
    // backgroundColor: "#d3e3dc",
    border: "0.0925rem solid #bdbdbd",
    borderRadius: "5px",
    marginTop: "2rem",
    marginBottom: "2rem",
  },
  materialNameAndDue: {
    // backgroundColor: "#d3e3dc",
    display: "flex",
    width: "100%",
    borderBottom: "0.0625rem solid #bdbdbd",
    marginBottom: "1rem",
    // margin: "1rem 1rem",
  },
  materialInfo: {
    // backgroundColor: "grey",
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    marginTop: "1rem",
    // margin: "1rem",
  },
  materialImage: {
    width: "2.5rem",
    borderRadius: "50%",
    border: "1px solid #bdbdbd",
    marginLeft: "1rem",
    marginTop: "1rem",
    marginBottom: "1rem",
  },
  materialTitle: {
    marginTop: "0.5rem",
    marginLeft: "1rem",
    color: "#3c4043",
    fontSize: "1rem",
    fontWeight: "600",
  },
  materialTimeStamp: {
    marginTop: "0.5rem",
    color: "rgba(0,0,0,0.549)",
    fontSize: "0.875rem",
    fontWeight: "500",
    marginRight: "1rem",
  },

  materialTeacher: {
    display: "flex",
    justifyContent: "space-between",
    margin: "1rem",
  },

  materialViewsCount: {
    fontSize: "2rem",
    fontWeight: "400",
    color: "#3c4043",
  },
  materialViewsContainer: {
    borderLeft: ".0625rem solid #bdbdbd",
    padding: "0 1rem",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#607d8b",
      borderRadius: "5px",
      "& > div": {
        color: "white",
      },
    },
  },
  materialViews: {
    color: "#5f6368",
  },
  materialInstruction: {
    fontSize: "1rem",
    marginTop: "3.5%",
    marginLeft: "5%",
  },
  materialInstructionAndViewed: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
  },
  materialLink: {
    textDecoration: "none",
    display: "flex",
    border: ".0625rem solid #bdbdbd",
    borderRadius: ".6rem",
    width: "40%",
    margin: "1rem 5%",
    // height: "5rem",
    height: "30%",
  },
  materialFileNameAndExtension: {
    width: "60%",
    padding: "1rem",
  },
  materialFileName: {
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap",
    color: "#3c4043",
    fontSize: "1rem",
    fontWeight: "600",
  },
  materialFileExtension: {
    color: "#5f6368",
    fontSize: "1rem",
  },
  materialMedia: {
    // display: "flex",
    borderRight: ".0625rem solid #bdbdbd",
    // borderRadius: "50%",
    width: "5rem",
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    // justifyContent: "center",
    // alignItems: "center",
    // overflow: "hidden",
  },
  studentInfo: {
    display: "flex",
    width: "100%",
    marginTop: ".8rem",
  },
  studentImage: {
    // border: "1px solid grey",
    borderRadius: "50%",
    width: "2.5rem",
    height: "2.5rem",
    backgroundSize: "cover",
    // marginTop: "10px",
  },
  studentName: {
    fontSize: "0.875rem",
    fontWeight: "600",
    color: "#3c4043",
    marginLeft: "1rem",
    marginTop: "0.6rem",
  },
  // studentList: {
  //   marginTop: ".5rem",
  // },
}));

function TopicContents() {
  const classes = useStyles();
  const { topic } = useParams();
  const location = useLocation();
  const { teachingClassName } = useParams();
  const [topicList, setTopicList] = useState();
  const teachingClassNameRef = database.ref(teachingClassName);
  const topicListRef = teachingClassNameRef.child("/Classwork" + "/Topic List");
  // console.log(location);

  useEffect(() => {
    getTopicList();
  }, []);

  function getTopicList() {
    topicListRef.on("value", (snapshot) => {
      const topics = snapshot.val();
      const topicList = [];
      // console.log("topics : ", topics);
      for (let id in topics) {
        topicList.push(topics[id]);
        // console.log("Key : ", id);
      }
      setTopicList(topicList);
    });
  }

  return (
    <>
      <TeachingClassroom />
      <div className={classes.topicContents}>
        {/* <Topics /> */}
        {/* <Topics topicList={topicList} /> */}
        <div className={classes.topicName}>{topic}</div>
        <hr />
        <TopicContentLists />
        {/* <TopicContentLists /> */}
        {/* <TopicContentLists /> */}
      </div>
    </>
  );
}

function TopicContentLists() {
  const classes = useStyles();
  const { topic } = useParams();
  const { currentUser } = useAuth();
  const [materialList, setMaterialList] = useState();
  const [questionList, setQuestionList] = useState();
  const [assignmentList, setAssignmentList] = useState();
  const { teachingClassName } = useParams();
  const teachingClassNameRef = database.ref(teachingClassName);
  const topicRef = teachingClassNameRef.child(
    "/Classwork" + "/Topic Content List" + "/" + topic
  );
  const materialRef = topicRef.child("/Materials");
  const questionRef = topicRef.child("/Questions");
  const assignmentRef = topicRef.child("/Assignments");
  const teacherRef = teachingClassNameRef.child("/People" + "/Teacher List");
  const [teacherUid, setTeacherUid] = useState();
  const [topicList, setTopicList] = useState();

  function getMaterial() {
    materialRef.on("value", (snapshot) => {
      const materials = snapshot.val();
      const materialList = [];
      // console.log("materials : ", materials);
      for (let id in materials) {
        // materialList.push(materials[id]);
        materialList.push({ id: id, material: materials[id] });
      }
      setMaterialList(materialList);
    });
  }

  function getQustions() {
    questionRef.on("value", (snapshot) => {
      const questions = snapshot.val();
      const questionList = [];
      // console.log("questions : ", questions);
      for (let id in questions) {
        questionList.push(questions[id]);
      }
      setQuestionList(questionList);
    });
  }

  function getAssignments() {
    assignmentRef.on("value", (snapshot) => {
      const asignments = snapshot.val();
      const asignmentList = [];
      // console.log("asignments : ", asignments);
      for (let id in asignments) {
        asignmentList.push(asignments[id]);
      }
      setAssignmentList(asignmentList);
    });
  }

  function getTeacherUid() {
    teacherRef.on("value", (snapshot) => {
      const teacherList = [];
      for (const key in snapshot.val()) {
        teacherList.push(snapshot.val()[key]);
      }
      setTeacherUid(teacherList[0].teacherUid);
      // console.log("teacherUid : " + snapshot.val()[0]);
      // console.log("teacherUid : " + teacherUid);
    });
  }

  useEffect(() => {
    getTeacherUid();
    getMaterial();
    getQustions();
    getAssignments();
  }, []);

  const Material = () => {
    const handleRead = (id) => {
      // const id = key;
      // setId(() => id);
      var studentList = [];
      var currentUserUid = materialRef.child(
        id + "/Student List" + "/" + currentUser.uid
      );
      const studentDetails = {
        userName: currentUser.displayName,
        userProfile: currentUser.photoURL,
        isRead: false,
      };

      var viewsRef = materialRef.child(id);
      var views = 0;

      viewsRef.on("value", (snap) => {
        views = snap.val().views;
      });

      var studentListRef = materialRef.child(id + "/Student List");
      studentListRef.on("value", (snap) => {
        // const studentList = [];
        const students = snap.val();
        for (let uid in students) {
          // console.log(uid);
          studentList.push({ uid, student: students[uid] });
        }
        // setStudentList(stuList);
      });

      if (currentUser.uid !== teacherUid) {
        if (studentList.length === 0) {
          currentUserUid.set(studentDetails);
          console.log("Count is 0");
        } else {
          var isCurrentUser = false;
          studentList.map((student) => {
            // console.log(student);
            // console.log(student.uid !== currentUser.uid);
            if (student.uid === currentUser.uid) {
              isCurrentUser = true;
              return;
            }
          });
          !isCurrentUser && currentUserUid.set(studentDetails);
        }
      }

      // currentUser.uid !== teacherUid &&
      //   viewsRef.update({
      //     views: views + 1,
      //   });

      if (currentUser.uid !== teacherUid) {
        studentList.map((student) => {
          if (currentUser.uid === student.uid && !student.student.isRead) {
            console.log(!student.student.isRead);
            viewsRef.update({
              views: views + 1,
            });
            currentUserUid.update({
              isRead: true,
            });
          }
        });
      }
      // console.log("views", views);
    };
    // console.log("studentList", studentList);

    return materialList.map((material, index) => (
      // <>
      //   <h1>{material.id}</h1>
      //   <h2>{JSON.stringify(material.material)}</h2>
      //   {/* <button onClick={() => handleDelete(material.id)}>Delete</button> */}
      //   <button onClick={() => handleRead(material.id)}>Mark as Read</button>
      // </>
      <div key={index} className={classes.material}>
        <div className={classes.materialNameAndDue}>
          <img className={classes.materialImage} src={materialImg} alt="" />
          <div className={classes.materialInfo}>
            <div className={classes.materialTitle}>
              {material.material.title}
            </div>
            <div className={classes.materialTimeStamp}>
              Posted {material.material.timeStamp}
            </div>
          </div>
        </div>
        {currentUser.uid === teacherUid ? (
          <MaterialTeacher material={material.material} id={material.id} />
        ) : (
          <MaterialStudent material={material.material} id={material.id} />
        )}
        <a
          href={material.material.materialUrl}
          target="_blank"
          className={classes.materialLink}
          onClick={() => handleRead(material.id)}
        >
          <div
            className={classes.materialMedia}
            style={{
              backgroundImage: `url(${material.material.materialUrl})`,
            }}
          >
            {/* <img
              src={material.materialUrl}
              style={{
                width: "100%",
                height: "100%",
                border: "none",
              }}
            /> */}
          </div>
          <div className={classes.materialFileNameAndExtension}>
            <div className={classes.materialFileName}>
              {material.material.fileName}
            </div>
            <div className={classes.materialFileExtension}>
              {material.material.fileName.split(".")[1] ===
              ("jpg" || "jpeg" || "png")
                ? "Image"
                : material.material.fileName.split(".")[1] === "pdf"
                ? "PDF"
                : material.material.fileName.split(".")[1] === ("ppt" || "pptx")
                ? "PPT"
                : material.material.fileName.split(".")[1] === ("doc" || "docx")
                ? "DOC"
                : material.material.fileName.split(".")[1] === ("mp3" || "wav")
                ? "AUDIO"
                : material.material.fileName.split(".")[1] ===
                  ("mp4" || "mov" || "avi" || "webm")
                ? "VIDEO"
                : ""}
            </div>
          </div>
        </a>
        {/* <h1>{JSON.stringify(material.key)}</h1> */}
      </div>
    ));

    function MaterialStudent({ material, id }) {
      return (
        <div className={classes.materialStudent}>
          <div className={classes.materialInstruction}>
            {material.instruction}
          </div>
        </div>
      );
    }

    function MaterialTeacher({ material, id }) {
      const [open, setOpen] = useState(false);
      const [studentList, setStudentList] = useState([]);

      useEffect(() => {
        getStudentList(id);
      }, []);

      function getStudentList(id) {
        var studentListRef = materialRef.child(id + "/Student List");
        studentListRef.on("value", (snap) => {
          const studentList = [];
          const students = snap.val();
          for (let uid in students) {
            // console.log(uid);
            studentList.push(students[uid]);
          }
          setStudentList(studentList);
        });
      }

      const handleViews = () => {
        setOpen(true);
      };

      const handleClose = () => {
        setOpen(false);
      };

      return (
        <div className={classes.materialTeacher}>
          <div className={classes.materialInstructionAndViewed}>
            {material.instruction && (
              <div className={classes.materialInstruction}>
                {material.instruction}
              </div>
            )}
            <div
              className={classes.materialViewsContainer}
              onClick={handleViews}
            >
              <div className={classes.materialViewsCount}>{material.views}</div>
              <div className={classes.materialViews}>
                {material.views > 1 ? "views" : "view"}
              </div>
            </div>
            <Dialog
              fullWidth
              open={open}
              onClose={handleClose}
              aria-labelledby="form-dialog-title"
            >
              <DialogTitle id="form-dialog-title" style={{ margin: "auto" }}>
                <b>{material.title}:</b> {material.views}{" "}
                {material.views > 1 ? "views" : "view"}
              </DialogTitle>
              <DialogContent>
                <div className={classes.studentList}>
                  {studentList &&
                    studentList.map((student, index) => (
                      <div className={classes.studentInfo} key={index}>
                        <div
                          className={classes.studentImage}
                          style={{
                            backgroundImage: `url(${student.userProfile})`,
                          }}
                        ></div>
                        <div className={classes.studentName}>
                          {student.userName}
                        </div>
                      </div>
                    ))}
                </div>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  Cancel
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        </div>
      );
    }
  };

  return (
    <div>
      {materialList && (
        <Material
          materialList={materialList}
          currentUser={currentUser}
          teacherUid={teacherUid}
        />
      )}
      {questionList && (
        <Question
          questionList={questionList}
          currentUser={currentUser}
          teacherUid={teacherUid}
        />
      )}
      {assignmentList && (
        <Assignment
          assignmentList={assignmentList}
          currentUser={currentUser}
          teacherUid={teacherUid}
        />
      )}
    </div>
  );
}

const Question = ({ questionList, teacherUid, currentUser }) => {
  const classes = useStyles();
  return questionList.map((question, index) => (
    <div key={index} className={classes.question}>
      <div className={classes.questionNameAndDue}>
        <img className={classes.questionImage} src={questionImg} alt="" />
        <div className={classes.questionInfo}>
          <div className={classes.questionTitle}>{question.question}</div>
          <div className={classes.questionTimeStamp}>
            Due {question.dueDate}
          </div>
        </div>
      </div>
      {currentUser.uid === teacherUid ? (
        <QuestionTeacher question={question} />
      ) : (
        <QuestionStudent question={question} />
      )}
      {/* {currentUser.uid !== teacherUid && <QuestionStudent />} */}
    </div>
  ));

  function QuestionStudent({ question }) {
    const [answer, setAnswer] = useState("");
    return (
      <div className={classes.questionStudent}>
        <div className={classes.questionInstruction}>
          {question.instruction}
        </div>
        <form className={classes.questionForm}>
          <TextField
            rows={3}
            onChange={(e) => setAnswer(e.target.value)}
            variant="filled"
            margin="dense"
            label="Type your Answer"
            multiline
            type="text"
            fullWidth
            value={answer}
            className={classes.answerTextField}
          />
          <div className={classes.questionTurnInBtnContainer}>
            <Button
              disabled={answer.trim().length === 0}
              className={classes.questionTurnInBtn}
              variant="contained"
              color="primary"
            >
              Turn in
            </Button>
          </div>
        </form>
      </div>
    );
  }

  function QuestionTeacher({ question }) {
    return (
      <div className={classes.questionTeacher}>
        <div className={classes.questionInstruction}>
          {question.instruction}
        </div>
        <div className={classes.questionTurnedInAndCount}>
          <div className={classes.questionTurnedInCount}>2</div>
          <div className={classes.questionTurnedIn}>Turned in</div>
        </div>
      </div>
    );
  }
};

const Assignment = ({ assignmentList, teacherUid, currentUser }) => {
  const classes = useStyles();
  return assignmentList.map((assignment, index) => (
    <div key={index} className={classes.assignment}>
      <div className={classes.assignmentNameAndDue}>
        <img className={classes.assignmentImage} src={assignmentImg} alt="" />
        <div className={classes.assignmentInfo}>
          <div className={classes.assignmentTitle}>{assignment.title}</div>
          <div className={classes.assignmentTimeStamp}>
            Due {assignment.dueDate}
          </div>
        </div>
      </div>
      {currentUser.uid === teacherUid ? (
        <AssignmentTeacher assignment={assignment} />
      ) : (
        <AssignmentStudent assignment={assignment} />
      )}
      {/* {currentUser.uid !== teacherUid && <QuestionStudent />} */}
    </div>
  ));

  function AssignmentStudent({ assignment }) {
    const [file, setFile] = useState();
    const handleFile = (e) => {
      setFile(e.target.files[0]);
    };
    return (
      <div className={classes.assignmentStudent}>
        <div className={classes.assignmentInstruction}>
          {assignment.instruction}
        </div>
        <form className={classes.assignmentForm}>
          <input
            // accept="image/*"
            className={classes.assignmentInputFile}
            id="contained-button-file"
            multiple
            type="file"
            onChange={handleFile}
          />
          <label htmlFor="contained-button-file">
            <Button
              variant="outlined"
              color="black"
              component="span"
              startIcon={<AttachFileIcon />}
              className={classes.assignmentAddBtn}
            >
              Add
            </Button>
          </label>
          <div className={classes.assignmentTurnInBtnContainer}>
            <Button
              disabled={!file}
              className={classes.assignmentTurnInBtn}
              variant="contained"
              color="primary"
            >
              Turn in
            </Button>
          </div>
        </form>
      </div>
    );
  }

  function AssignmentTeacher({ assignment }) {
    return (
      <div className={classes.assignmentTeacher}>
        <div className={classes.assignmentInstruction}>
          {assignment.instruction}
        </div>
        <div className={classes.assignmentTurnedInAndCount}>
          <div className={classes.assignmentTurnedInCount}>2</div>
          <div className={classes.assignmentTurnedIn}>Turned in</div>
        </div>
      </div>
    );
  }
};

export default TopicContents;
