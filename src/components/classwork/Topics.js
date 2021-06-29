import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  topicList: {
    width: "100%",
    // margin: "auto",
    margin: "30% 20%",
  },
  allTopic: {
    fontSize: "0.9rem",
    fontWeight: "600",
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap",
  },
  allTopicLink: {
    marginBottom: "0.5rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#d3e3dc",
    height: "2.5rem",
    width: "60%",
    color: "#5f6368",
    textDecoration: "none",
    borderRadius: "0.4rem",
  },
  topic: {
    fontSize: "0.9rem",
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap",
  },
  topicLink: {
    marginBottom: "0.5rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textDecoration: "none",
    height: "2.5rem",
    width: "60%",
    color: "#5f6368",
    "&:hover": {
      borderRadius: "0.4rem",
      backgroundColor: "#d3e3dc",
      // backgroundColor: "grey",
      // color: "white",
    },
  },
}));

function Topics({ topicList }) {
  const classes = useStyles();
  const { teachingClassName } = useParams();
  const classworkClassName = "/" + teachingClassName + "/classwork";

  return (
    <div className={classes.topicList}>
      <Link className={classes.allTopicLink} to={classworkClassName}>
        <div className={classes.allTopic}>All Topics </div>
      </Link>
      {/* <br /> */}
      {topicList &&
        topicList.map((topic, index) => (
          <Link
            key={index}
            className={classes.topicLink}
            to={{
              pathname: "/" + teachingClassName + "/classwork" + "/" + topic,
            }}
          >
            <div className={classes.topic}>{topic}</div>
          </Link>
        ))}
    </div>
  );
}

export default Topics;
