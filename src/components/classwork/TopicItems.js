import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { database } from "../../firebase/firebase";
import assignmentImg from "../../assets/assignment.png";
import materialImg from "../../assets/material.png";
import questionImg from "../../assets/question.png";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  link: {
    textDecoration: "none",
  },
  topic: {
    fontSize: "2rem",
    fontWeight: "400",
    color: "#202124",
  },
  topicItems: {
    marginTop: "3rem",
    marginBottom: "3rem",
    padding: "1rem",
    "&:hover": {
      // cursor: "pointer",
      borderRadius: "0.5rem",
      backgroundColor: "#d3e3dc",
      boxShadow: ".3rem .3rem #a1ccca",
    },
  },
  topicItemList: {
    marginTop: "1rem",
  },
  material: {
    // backgroundColor: "#cfcfc6",
    marginTop: "1rem",
    display: "flex",
    width: "100%",
  },
  materialInfo: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
  },
  materialImage: {
    width: "2rem",
    borderRadius: "50%",
    border: "1px solid grey",
  },
  materialTitle: {
    marginTop: "0.5rem",
    marginLeft: "1rem",
    color: "#3c4043",
    fontSize: "1rem",
    fontWeight: "500",
  },
  materialTimeStamp: {
    marginTop: "0.5rem",
    color: "rgba(0,0,0,0.549)",
    fontSize: "0.875rem",
    fontWeight: "500",
  },
  question: {
    // backgroundColor: "#cfcfc6",
    marginTop: "1rem",
    display: "flex",
    width: "100%",
  },
  questionInfo: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
  },
  questionImage: {
    width: "2rem",
    borderRadius: "50%",
    border: "1px solid grey",
  },
  questionTitle: {
    marginTop: "0.5rem",
    marginLeft: "1rem",
    color: "#3c4043",
    fontSize: "1rem",
    fontWeight: "500",
  },
  questionTimeStamp: {
    marginTop: "0.5rem",
    color: "rgba(0,0,0,0.549)",
    fontSize: "0.875rem",
    fontWeight: "500",
  },
  assignment: {
    // backgroundColor: "#cfcfc6",
    marginTop: "1rem",
    display: "flex",
    width: "100%",
  },
  assignmentInfo: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
  },
  assignmentImage: {
    width: "2rem",
    borderRadius: "50%",
    border: "1px solid grey",
  },
  assignmentTitle: {
    marginTop: "0.5rem",
    marginLeft: "1rem",
    color: "#3c4043",
    fontSize: "1rem",
    fontWeight: "500",
  },
  assignmentTimeStamp: {
    marginTop: "0.5rem",
    color: "rgba(0,0,0,0.549)",
    fontSize: "0.875rem",
    fontWeight: "500",
  },
}));

function TopicItems({ topicContentList: topicList }) {
  const classes = useStyles();
  return (
    <>
      {/* <div className={classes.topicItems}>
        <TopicItemLists topic="No Topic" />
      </div> */}
      {topicList &&
        topicList.map((topic, index) => (
          <>
            {topic === "No Topic" && (
              <div className={classes.topicItems}>
                <TopicItemLists topic="No Topic" />
              </div>
            )}
            {topic !== "No Topic" && (
              <div className={classes.topicItems} key={index}>
                <div className={classes.topic}>{topic}</div>
                <hr />
                <TopicItemLists topic={topic} />
              </div>
            )}
          </>
        ))}
    </>
  );
}

function TopicItemLists({ topic }) {
  const classes = useStyles();
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

  function getMaterial() {
    materialRef.on("value", (snapshot) => {
      const materials = snapshot.val();
      const materialList = [];
      // console.log("materials : ", materials);
      for (let id in materials) {
        materialList.push(materials[id]);
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

  useEffect(() => {
    getMaterial();
    getQustions();
    getAssignments();
  }, []);

  return (
    <div className={classes.topicItemList}>
      <Link
        className={classes.link}
        to={{
          pathname: "/" + teachingClassName + "/classwork" + "/" + topic,
          state: { materialList: materialList },
        }}
      >
        {materialList &&
          materialList.map((material, index) => (
            <div className={classes.material} key={index}>
              <img
                src={materialImg}
                alt=""
                className={classes.materialImage}
                // style={{ width: "40px" }}
              />
              <div className={classes.materialInfo}>
                <div className={classes.materialTitle}>{material.title}</div>
                {/* <div className={classes.commentCount}>comment count</div> */}
                <div className={classes.materialTimeStamp}>
                  Posted {material.timeStamp}
                </div>
              </div>
            </div>
          ))}
        {questionList &&
          questionList.map((question, index) => (
            <div key={index} className={classes.question}>
              <img
                className={classes.questionImage}
                src={questionImg}
                alt=""
                // style={{ width: "40px" }}
              />
              <div className={classes.questionInfo}>
                <div className={classes.questionTitle}>{question.question}</div>
                {/* <div>comment count</div> */}
                <div className={classes.questionTimeStamp}>
                  Due {question.dueDate}
                </div>
              </div>
            </div>
          ))}
        {assignmentList &&
          assignmentList.map((assignment, index) => (
            <div key={index} className={classes.assignment}>
              <img
                className={classes.assignmentImage}
                src={assignmentImg}
                alt=""
                // style={{ width: "40px" }}
              />
              <div className={classes.assignmentInfo}>
                <div className={classes.assignmentTitle}>
                  {assignment.title}
                </div>
                {/* <div>comment count</div> */}
                <div className={classes.assignmentTimeStamp}>
                  Due {assignment.dueDate}
                </div>
              </div>
            </div>
          ))}
      </Link>
    </div>
  );
}

export default TopicItems;
