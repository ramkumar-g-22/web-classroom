import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { database } from "../../firebase/firebase";
import Classes from "../class/Classes";
import TeachingClassroom from "../TeachingClassroom";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  teacherImage: {
    // border: "1px solid grey",
    borderRadius: "50%",
    width: "2.5rem",
    height: "2.5rem",
    backgroundSize: "cover",
    // marginTop: "10px",
  },
  teacherName: {
    fontSize: "0.875rem",
    fontWeight: "600",
    color: "#3c4043",
    marginLeft: "1rem",
    marginTop: "0.5rem",
  },
  teachers: {
    fontSize: "2rem",
    fontWeight: "400",
    color: "#202124",
  },
  teacherInfo: {
    margin: "auto",
    display: "flex",
    width: "50%",
    marginTop: "1rem",
  },
  teacherProfile: {
    margin: "auto",
    width: "50%",
    marginTop: "1.7rem",
  },
  studentProfile: {
    marginTop: "1.7rem",
    display: "flex",
    margin: "auto",
    width: "50%",
    justifyContent: "space-between",
  },
  students: {
    fontSize: "2rem",
    fontWeight: "400",
    color: "#202124",
  },
  studentInfo: {
    display: "flex",
    width: "50%",
    margin: "auto",
    marginTop: "1.5rem",
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
  studentCount: {
    fontSize: "0.875rem",
    fontWeight: "600",
    color: "#3c4043",
    marginTop: "1rem",
  },
}));

function People() {
  const classes = useStyles();
  const [teacherList, setTeacherList] = useState();
  const [studentCount, setStudentCount] = useState(0);
  const [studentList, setStudentList] = useState();

  const { teachingClassName } = useParams();
  const teachingClassNameRef = database.ref(teachingClassName);
  // console.log("teachingClassName : ", teachingClassName);
  const teacherRef = teachingClassNameRef.child("/People" + "/Teacher List");
  const studentRef = teachingClassNameRef.child("/People" + "/Student List");

  function getTeacherList() {
    teacherRef.on("value", (snapshot) => {
      const teacherList = [];
      const teachers = snapshot.val();
      for (const key in teachers) {
        const teacher = teachers[key];
        teacherList.push(teacher);
      }
      setTeacherList(teacherList);
    });
  }

  function getStudentList() {
    studentRef.on("value", (snapshot) => {
      const studentList = [];
      const students = snapshot.val();
      for (const key in students) {
        const student = students[key];
        studentList.push(student);
        setStudentCount((studentCount) => studentCount + 1);
      }
      setStudentList(studentList);
    });
  }

  useEffect(() => {
    getTeacherList();
    getStudentList();
  }, []);

  return (
    <div>
      <TeachingClassroom />
      <div className={classes.teacherProfile}>
        <div className={classes.teachers}>Teachers</div>
        <hr />
      </div>
      {teacherList &&
        teacherList.map((teacher, index) => (
          <div className={classes.teacherInfo} key={index}>
            {/* <img src={teacher.teacherProfile} alt={teacher.teacherName} /> */}
            <div
              className={classes.teacherImage}
              style={{
                backgroundImage: `url(${teacher.teacherProfile})`,
              }}
            ></div>
            <div className={classes.teacherName}>{teacher.teacherName}</div>
          </div>
        ))}
      <div className={classes.studentProfile}>
        <div className={classes.students}>Students</div>
        <div className={classes.studentCount}>
          {studentCount} {studentCount > 1 ? "students" : "student"}
        </div>
      </div>
      <hr style={{ width: "50%" }} />
      <div>
        {studentList &&
          studentList.map((student, index) => (
            <div className={classes.studentInfo} key={index}>
              <div
                className={classes.studentImage}
                style={{
                  backgroundImage: `url(${student.studentProfile})`,
                }}
              ></div>
              <div className={classes.studentName}>{student.studentName}</div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default People;
