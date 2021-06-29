import React from "react";
import { useHistory, useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Meet from "./meet/Meet";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  indicator: {
    top: "2.8rem",
    height: "0.25rem",
    borderRadius: "10px",
  },
  classwork: {
    fontWeight: "600",
    textTransform: "none",
  },
  stream: {
    textTransform: "none",
    fontWeight: "600",
  },
  people: {
    textTransform: "none",
    fontWeight: "600",
  },
  meet: {
    textTransform: "none",
    fontWeight: "600",
  },
}));

function TeachingClassroom() {
  const classes = useStyles();

  const { teachingClassName } = useParams();
  const { topic } = useParams();
  const history = useHistory();

  // console.log(history);
  const stream = "/" + teachingClassName + "/stream";
  const classwork = "/" + teachingClassName + "/classwork";
  const topicName = "/" + teachingClassName + "/classwork" + "/" + topic;
  const people = "/" + teachingClassName + "/people";
  const meet = "/" + teachingClassName + "/meet";

  const handleChange = (event, value) => {
    // console.log(history.location.pathname);
    // console.log(value);
    history.location.pathname !== value && history.push(value);
  };

  return (
    <div className={classes.root}>
      <Paper>
        <Tabs
          classes={{
            indicator: classes.indicator,
          }}
          value={history.location.pathname}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab className={classes.stream} label="Stream" value={stream} />
          <Tab
            className={classes.classwork}
            label="Classwork"
            value={
              history.location.pathname === classwork
                ? classwork
                : history.location.pathname === topicName
                ? topicName
                : classwork
            }
          />
          <Tab className={classes.people} label="People" value={people} />
          {/* <Tab label="Meet" value={meet} className={classes.meet} /> */}
        </Tabs>
      </Paper>
    </div>
  );
}

export default TeachingClassroom;
