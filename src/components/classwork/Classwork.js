import React, { useEffect, useState } from "react";
import TeachingClassroom from "../TeachingClassroom";
import TopicItems from "./TopicItems";
import Topics from "./Topics";
import TopicContents from "./TopicContents";
import AddTopic from "./AddTopic";
import Assignment from "./Assignment";
import Question from "./Question";
import Material from "./Material";
import { useParams } from "react-router-dom";
import { database } from "../../firebase/firebase";
import { useAuth } from "../../context/AuthContext";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  classwork: {
    display: "flex",
  },
  topicLists: {
    width: "20%",
  },
  topicContents: {
    width: "60%",
  },
  createButtons: {
    display: "flex",
    marginTop: "1.5rem",
    justifyContent: "space-evenly",
  },
  // topicItem: {
  //   // marginTop: "2rem",
  // },
}));

function Classwork() {
  const classes = useStyles();
  const { currentUser } = useAuth();
  const { teachingClassName } = useParams();
  const [teacherUid, setTeacherUid] = useState();
  const [topicList, setTopicList] = useState();
  const [topicContentList, setTopicContentList] = useState();
  const teachingClassNameRef = database.ref(teachingClassName);
  const topicListRef = teachingClassNameRef.child("/Classwork" + "/Topic List");
  const topicContentListRef = teachingClassNameRef.child(
    "/Classwork" + "/Topic Content List"
  );
  const teacherRef = teachingClassNameRef.child("/People" + "/Teacher List");

  useEffect(() => {
    getTopicList();
    getTopicContentList();
    getTeacherUid();
  }, []);

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

  function getTopicContentList() {
    topicContentListRef.on("value", (snapshot) => {
      const topics = snapshot.val();
      const topicContentList = [];
      for (let id in topics) {
        topicContentList.push(id);
        // console.log("Key : " + id);
      }
      setTopicContentList(topicContentList);
      // console.log("topicContentList : " + topicContentList);
    });
  }

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
      <div className={classes.classwork}>
        <div className={classes.topicLists}>
          <Topics topicList={topicList} />
        </div>
        <div className={classes.topicContents}>
          {currentUser.uid === teacherUid && (
            <div className={classes.createButtons}>
              <AddTopic />
              <Material topicList={topicList} />
              <Assignment topicList={topicList} />
              <Question topicList={topicList} />
            </div>
          )}
          <div className={classes.topicItem}>
            <TopicItems topicContentList={topicContentList} />
          </div>
        </div>
      </div>
    </>
  );
}

export default Classwork;
