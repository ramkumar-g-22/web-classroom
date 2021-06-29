import React, { useEffect, useState } from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import { database } from "../../firebase/firebase";
import assignmentImg from "../../assets/assignment.png";
import materialImg from "../../assets/material.png";
import questionImg from "../../assets/question.png";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  userAnnouncement: {
    marginTop: "20px",
    margin: "auto",
    width: "75%",
    border: "1px solid rgba(0,0,0,0.2)",
    borderRadius: "5px",
  },
  userProfile: {
    display: "flex",
  },
  userInfo: {
    marginLeft: "10px",
    marginTop: "10px",
  },
  userName: {
    color: "#5f6368",
    fontSize: "0.875rem",
    fontWeight: "600",
  },
  userTimeStamp: {
    fontSize: "0.75rem",
    fontWeight: "500",
    color: "#5f6368",
  },
  userText: {
    marginLeft: "15px",
    marginTop: "10px",
    marginBottom: "20px",
    color: "rgba(0,0,0,0.87)",
    fontSize: "0.95rem",
    fontWeight: "500",
  },
  userImage: {
    // border: "1px solid grey",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    backgroundSize: "cover",
    marginLeft: "15px",
    marginTop: "10px",
  },
  assignment: {
    marginTop: "20px",
    margin: "auto",
    width: "75%",
    display: "flex",
    border: "1px solid rgba(0,0,0,0.2)",
    borderRadius: "5px",
    textDecoration: "none",
    "&:hover": {
      backgroundColor: "#d3e3dc",
      cursor: "pointer",
    },
  },
  assignmentImage: {
    border: "1px solid grey",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    backgroundSize: "cover",
    marginLeft: "15px",
    marginTop: "10px",
  },
  assignmentInfo: {
    marginLeft: "10px",
    marginTop: "10px",
    marginBottom: "20px",
  },
  assignmentTitle: {
    fontSize: "0.875rem",
    fontWeight: "600",
    color: "#5f6368",
  },
  assignmentTimeStamp: {
    fontSize: "0.75rem",
    fontWeight: "500",
    color: "#5f6368",
  },
  question: {
    marginTop: "20px",
    margin: "auto",
    width: "75%",
    display: "flex",
    border: "1px solid rgba(0,0,0,0.2)",
    borderRadius: "5px",
    textDecoration: "none",
    "&:hover": {
      backgroundColor: "#d3e3dc",
      cursor: "pointer",
    },
  },
  questionImage: {
    border: "1px solid grey",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    backgroundSize: "cover",
    marginLeft: "15px",
    marginTop: "10px",
  },
  questionInfo: {
    marginLeft: "10px",
    marginTop: "10px",
    marginBottom: "20px",
  },
  questionTitle: {
    color: "#5f6368",
    fontSize: "0.875rem",
    fontWeight: "600",
  },
  questionTimeStamp: {
    fontSize: "0.75rem",
    fontWeight: "500",
    color: "#5f6368",
  },
  material: {
    marginTop: "20px",
    margin: "auto",
    width: "75%",
    display: "flex",
    border: "1px solid rgba(0,0,0,0.2)",
    borderRadius: "5px",
    textDecoration: "none",
    "&:hover": {
      backgroundColor: "#d3e3dc",
      cursor: "pointer",
    },
  },
  materialImage: {
    border: "1px solid grey",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    backgroundSize: "cover",
    marginLeft: "15px",
    marginTop: "10px",
  },
  materialInfo: {
    marginLeft: "10px",
    marginTop: "10px",
    marginBottom: "20px",
  },
  materialTitle: {
    color: "#5f6368",
    fontSize: "0.875rem",
    fontWeight: "600",
  },
  materialTimeStamp: {
    fontSize: "0.75rem",
    fontWeight: "500",
    color: "#5f6368",
  },

  materialLink: {
    textDecoration: "none",
    display: "flex",
    border: ".0625rem solid #e0e0e0",
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
    borderRight: ".0625rem solid #e0e0e0",
    // borderRadius: "50%",
    width: "5rem",
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    // justifyContent: "center",
    // alignItems: "center",
    // overflow: "hidden",
  },
}));

function Announcements() {
  const classes = useStyles();
  const [announcementList, setAnnouncementList] = useState();
  const { teachingClassName, topic } = useParams();
  const [teacherDetails, setTeacherDetails] = useState([]);
  useEffect(() => {
    const teachingClassNameRef = database.ref(teachingClassName);
    const announcementRef = teachingClassNameRef.child(
      "/Stream" + "/Announcements"
    );
    const teacherListRef = teachingClassNameRef.child(
      "/People" + "/Teacher List"
    );
    teacherListRef.on("value", (snap) => {
      const teacherDetail = snap.val();
      const teacherDetailList = [];
      for (let id in teacherDetail) {
        teacherDetailList.push(teacherDetail[id]);
      }
      setTeacherDetails(teacherDetailList);
      // console.log("teacherDetailList : " + teacherDetails[0].teacherProfile);
    });
    // console.log("announcementRef : ", announcementRef);
    announcementRef.on("value", (snapshot) => {
      const announcements = snapshot.val();
      const announcementList = [];
      // console.log("announcements : ", announcements);
      for (let id in announcements) {
        announcementList.push(announcements[id]);
        // console.log("Key : ", id);
        // console.log("announcements[id] : " + announcements[id]);
      }
      setAnnouncementList(announcementList);
      // console.log("announcementList : ", announcementList);
    });
  }, []);

  return (
    <div style={{ marginTop: "40px", marginBottom: "30px" }}>
      {announcementList
        ? announcementList.map((announcement, index) => (
            <div key={index}>
              {announcement.contentType &&
                announcement.contentType === "Assignment" && (
                  <Link
                    // key={index + announcement.title}
                    className={classes.assignment}
                    to={`/${teachingClassName}/classwork/${announcement.topic}`}
                  >
                    {/* <div className={classes.assignment}> */}
                    <div
                      className={classes.assignmentImage}
                      style={{
                        backgroundImage: `url(${assignmentImg})`,
                      }}
                    ></div>
                    <div className={classes.assignmentInfo}>
                      <div className={classes.assignmentTitle}>
                        {teacherDetails[0].teacherName} posted a new assignment
                        : {announcement.title}
                      </div>
                      <div className={classes.assignmentTimeStamp}>
                        {announcement.dueDate}
                      </div>
                    </div>
                    {/* </div> */}
                  </Link>
                )}
              {announcement.contentType &&
                announcement.contentType === "Material" && (
                  <Link
                    // key={index + announcement.title}
                    className={classes.material}
                    to={`/${teachingClassName}/classwork/${announcement.topic}`}
                  >
                    {/* <div className={classes.material}> */}
                    <div
                      className={classes.materialImage}
                      style={{
                        backgroundImage: `url(${materialImg})`,
                      }}
                    ></div>
                    <div className={classes.materialInfo}>
                      <div className={classes.materialTitle}>
                        {teacherDetails[0].teacherName} posted a new material :{" "}
                        {announcement.title}
                      </div>
                      <div className={classes.materialTimeStamp}>
                        {announcement.timeStamp}
                      </div>
                    </div>
                    {/* </div> */}
                  </Link>
                )}
              {announcement.contentType &&
                announcement.contentType === "Question" && (
                  <Link
                    // key={index + announcement.question}
                    className={classes.question}
                    to={`/${teachingClassName}/classwork/${announcement.topic}`}
                  >
                    {/* <div className={classes.question}> */}
                    <div
                      className={classes.questionImage}
                      style={{
                        backgroundImage: `url(${questionImg})`,
                      }}
                    ></div>
                    <div className={classes.questionInfo}>
                      <div className={classes.questionTitle}>
                        {teacherDetails[0].teacherName} posted a new question :{" "}
                        {announcement.question}
                      </div>
                      <div className={classes.questionTimeStamp}>
                        {announcement.dueDate}
                      </div>
                    </div>
                    {/* </div> */}
                  </Link>
                )}
              {!announcement.contentType && (
                <div
                  className={classes.userAnnouncement}
                  // key={index + announcement.text}
                >
                  <div className={classes.userProfile}>
                    <div
                      className={classes.userImage}
                      style={{
                        backgroundImage: `url(${announcement.photoUrl})`,
                      }}
                    ></div>
                    <div className={classes.userInfo}>
                      <div className={classes.userName}>
                        {announcement.userName}
                      </div>
                      <div className={classes.userTimeStamp}>
                        {announcement.timeStamp}
                      </div>
                    </div>
                  </div>
                  <div className={classes.userText}>{announcement.text}</div>
                  {announcement.fileName && (
                    <a
                      href={announcement.materialUrl}
                      target="_blank"
                      className={classes.materialLink}
                    >
                      <div
                        className={classes.materialMedia}
                        style={{
                          backgroundImage: `url(${announcement.materialUrl})`,
                        }}
                      ></div>
                      <div className={classes.materialFileNameAndExtension}>
                        <div className={classes.materialFileName}>
                          {announcement.fileName}
                        </div>
                        <div className={classes.materialFileExtension}>
                          {announcement.fileName.split(".")[1] ===
                          ("jpg" || "jpeg" || "png")
                            ? "Image"
                            : announcement.fileName.split(".")[1] === "pdf"
                            ? "PDF"
                            : announcement.fileName.split(".")[1] ===
                              ("ppt" || "pptx")
                            ? "PPT"
                            : announcement.fileName.split(".")[1] ===
                              ("doc" || "docx")
                            ? "DOC"
                            : announcement.fileName.split(".")[1] ===
                              ("mp3" || "wav")
                            ? "AUDIO"
                            : announcement.fileName.split(".")[1] ===
                              ("mp4" || "mov" || "avi" || "webm")
                            ? "VIDEO"
                            : "TEXT"}
                        </div>
                      </div>
                    </a>
                  )}
                </div>
              )}
            </div>
          ))
        : ""}
    </div>
  );
}

export default Announcements;
