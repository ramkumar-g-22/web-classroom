import React, { useEffect, useState } from "react";
import {
  Link,
  NavLink,
  useHistory,
  useLocation,
  useParams,
  withRouter,
} from "react-router-dom";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { IconButton, makeStyles, MenuItem, MenuList } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import HomeIcon from "@material-ui/icons/Home";

import { useAuth } from "../context/AuthContext";
import { database } from "../firebase/firebase";

const useStyles = makeStyles((theme) => ({
  menuButton: {
    marginRight: theme.spacing(4),
  },
  teacherProfile: {
    borderRadius: "50%",
    width: "30px",
  },
  userProfile: {
    borderRadius: "50%",
    width: "30px",
  },
  listContainer: {
    width: "300px",
  },
  // list: {
  //   width: "50%",
  // },
  home: {
    fontWeight: "600",
    fontSize: ".875rem",
    color: "#3c4043",
  },
  classNameAndSection: {
    display: "flex",
    flexDirection: "column",
    // height: "30px",
    width: "100%",
  },
  className: {
    fontWeight: "600",
    fontSize: ".875rem",
    color: "#3c4043",
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap",
  },
  section: {
    fontSize: ".75rem",
    fontWeight: "600",
    color: "#5f6368",
  },
  teaching: {
    fontWeight: "600",
    fontSize: ".875rem",
    color: "#80868b",
    marginTop: "1rem",
    marginLeft: "1rem",
  },
  enrolled: {
    fontWeight: "600",
    fontSize: ".875rem",
    color: "#80868b",
    marginTop: "1rem",
    marginLeft: "1rem",
  },
  navLink: {
    textDecoration: "none",
    width: "100%",
  },
  menuItem: {
    "&:hover": {
      backgroundColor: "#b0bec5",
      // "& div": {
      //   color: theme.palette.common.white,
      // },
      borderTopRightRadius: "1.5rem",
      borderBottomRightRadius: "1.5rem",
    },
  },
  menuList: {
    width: "290px",
    "& .Mui-selected": {
      backgroundColor: "#78909c",
      "& .MuiListItemIcon-root, & div": {
        color: theme.palette.common.white,
      },
      "&:hover": {
        backgroundColor: "#78909c",
        "& .MuiListItemIcon-root, & div": {
          color: theme.palette.common.white,
        },
      },
      borderTopRightRadius: "1.5rem",
      borderBottomRightRadius: "1.5rem",
    },
  },
}));

function DrawerMenu() {
  const classes = useStyles();
  const { currentUser } = useAuth();
  const [enrolledClassInfo, setEnrolledClassInfo] = useState([]);
  const [teachingClassInfo, setTeachingClassInfo] = useState([]);
  const [open, setOpen] = useState(false);
  const { topic } = useParams();

  const history = useHistory();
  const location = useLocation();

  // console.log(location);
  // console.log(topic);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    var userInfoRef = database.ref("User Info");
    var teachingClassesRef = userInfoRef.child(
      "Teaching Classes/" + currentUser.uid
    );
    teachingClassesRef.on("value", (snapshot) => {
      const classInformations = snapshot.val();
      const teachingClassInfo = [];
      for (let key in classInformations) {
        teachingClassInfo.push(classInformations[key]);
        // console.log("Key : ", key);
      }
      //   console.log(classInfo);
      setTeachingClassInfo(teachingClassInfo);
    });
  }, []);

  useEffect(() => {
    var userInfoRef = database.ref("User Info");
    var enrolledClassesRef = userInfoRef.child(
      "Enrolled Classes/" + currentUser.uid
    );
    enrolledClassesRef.on("value", (snapshot) => {
      const classInformations = snapshot.val();
      const enrolledClassInfo = [];
      for (let key in classInformations) {
        enrolledClassInfo.push(classInformations[key]);
        // console.log("Key : ", key);
      }
      //   console.log(classInfo);
      setEnrolledClassInfo(enrolledClassInfo);
    });
  }, []);

  return (
    <>
      <IconButton
        edge="start"
        className={classes.menuButton}
        color="inherit"
        aria-label="menu"
        onClick={handleDrawerOpen}
      >
        <MenuIcon />
      </IconButton>
      <Drawer open={open} onClose={handleDrawerClose}>
        <div className={classes.listContainer}>
          <MenuList className={classes.menuList}>
            <MenuItem
              style={{ height: "50px" }}
              component={Link}
              to="/"
              onClick={handleDrawerClose}
              className={classes.menuItem}
              selected={history.location.pathname === "/"}
            >
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <div className={classes.home}>Home</div>
            </MenuItem>
          </MenuList>
          <Divider />
          {teachingClassInfo.length !== 0 && (
            <>
              <div className={classes.teaching}>Teaching </div>
              <MenuList className={classes.menuList}>
                {teachingClassInfo.map((classInfo, index) => {
                  // const to = "/" + classInfo.className + "/stream";
                  const toStream = `/${classInfo.className}/stream`;
                  const toClasswork = `/${classInfo.className}/classwork`;
                  const toClassworkTopic = `/${classInfo.className}/classwork/${topic}`;
                  const toPeople = `/${classInfo.className}/people`;
                  const toMeet = `/${classInfo.className}/meet`;
                  return (
                    <MenuItem
                      key={index}
                      component={Link}
                      to={toStream}
                      onClick={handleDrawerClose}
                      key={classInfo.classCode}
                      selected={
                        toStream === history.location.pathname ||
                        toClasswork === history.location.pathname ||
                        toClassworkTopic === history.location.pathname ||
                        toPeople === history.location.pathname ||
                        toMeet === history.location.pathname
                      }
                      className={classes.menuItem}
                    >
                      <ListItemIcon>
                        <img
                          src={currentUser.photoURL}
                          className={classes.userProfile}
                        />
                      </ListItemIcon>
                      <div className={classes.classNameAndSection}>
                        <div className={classes.className}>
                          {classInfo.className}
                        </div>
                        <div className={classes.section}>
                          {classInfo.section}
                        </div>
                      </div>
                    </MenuItem>
                  );
                })}
              </MenuList>
              <Divider />
            </>
          )}
          {enrolledClassInfo !== 0 && (
            <>
              <div className={classes.enrolled}>Enrolled</div>
              <MenuList className={classes.menuList}>
                {enrolledClassInfo.map((classInfo, index) => {
                  const to = `/${classInfo.className}/stream`;
                  const toClasswork = `/${classInfo.className}/classwork`;
                  const toClassworkTopic = `/${classInfo.className}/classwork/${topic}`;
                  const toPeople = `/${classInfo.className}/people`;
                  const toMeet = `/${classInfo.className}/meet`;

                  return (
                    <MenuItem
                      key={index}
                      component={Link}
                      to={to}
                      onClick={handleDrawerClose}
                      key={classInfo.classCode}
                      selected={
                        to === history.location.pathname ||
                        toClasswork === history.location.pathname ||
                        toClassworkTopic === history.location.pathname ||
                        toPeople === history.location.pathname ||
                        toMeet === history.location.pathname
                      }
                      className={classes.menuItem}
                    >
                      <ListItemIcon>
                        <img
                          src={classInfo.userProfile}
                          className={classes.userProfile}
                        />
                      </ListItemIcon>
                      <div className={classes.classNameAndSection}>
                        <div className={classes.className}>
                          {classInfo.className}
                        </div>
                        <div className={classes.section}>
                          {classInfo.section}
                        </div>
                      </div>
                    </MenuItem>
                  );
                })}
              </MenuList>
            </>
          )}
        </div>
      </Drawer>
    </>
  );
}

export default withRouter(DrawerMenu);
