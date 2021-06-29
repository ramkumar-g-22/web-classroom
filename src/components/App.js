import React from "react";
import {
  Switch,
  Route,
  Link,
  BrowserRouter,
  withRouter,
} from "react-router-dom";
import {
  AppBar,
  IconButton,
  makeStyles,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
  Snackbar,
} from "@material-ui/core";

import DrawerMenu from "./DrawerMenu";
import Login from "./login/Login";
import PrivateRoute from "./PrivateRoute";
import Stream from "./stream/Stream";
import Classwork from "./classwork/Classwork";
import People from "./people/People";
import TopicContents from "./classwork/TopicContents";
import { AuthProvider, useAuth } from "../context/AuthContext";
import Dashboard from "./Dashboard";
import JoinClass from "./join class/JoinClass";
import CreateClass from "./create class/CreateClass";
import SignUp from "./signup/SignUp";
import Meet from "./meet/Meet";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: "grey",
  },
  // menuButton: {
  //   marginRight: theme.spacing(2),
  // },
  title: {
    flexGrow: 1,
    fontSize: "1.4rem",
    // fontWeight: "600",
  },

  joinClassBtn: {
    color: "white",
    fontWeight: "bold",
    marginRight: "30px",
    // textTransform: "none",
  },
  createClassBtn: {
    marginRight: "10px",
    color: "white",
    fontWeight: "bold",
  },
  profile: {
    borderRadius: "50%",
    width: "35px",
  },
}));

function App() {
  const { currentUser } = useAuth();

  return (
    <AuthProvider>
      <BrowserRouter>
        {currentUser && <NavAppBar />}
        <Switch>
          <PrivateRoute exact path="/" component={Dashboard} />
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/signup" component={SignUp} />

          <PrivateRoute
            exact
            path="/:teachingClassName/stream"
            component={Stream}
          />
          <PrivateRoute
            exact
            path="/:teachingClassName/classwork"
            component={Classwork}
          />
          <PrivateRoute
            exact
            path="/:teachingClassName/classwork/:topic"
            component={TopicContents}
          />
          <PrivateRoute
            exact
            path="/:teachingClassName/people"
            component={People}
          />
          <PrivateRoute
            exact
            path="/:teachingClassName/meet"
            component={Meet}
          />
        </Switch>
      </BrowserRouter>
    </AuthProvider>
  );
}

function NavAppBar() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { currentUser, logout } = useAuth();
  const classes = useStyles();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  async function handleLogout() {
    try {
      setAnchorEl(null);
      await logout();
      // history.push("/login");
    } catch (error) {
      console.log("Logout Error :", error);
    }
  }
  return (
    <AppBar position="static" className={classes.root}>
      <Toolbar>
        {currentUser && <DrawerMenu />}
        <Typography variant="h6" className={classes.title}>
          Web Classroom
        </Typography>
        {currentUser && <CreateClass />}
        {currentUser && <JoinClass />}
        <IconButton
          edge="start"
          aria-controls="simple-menu"
          className={classes.menuButton}
          color="inherit"
          aria-label="menu"
          onClick={handleClick}
        >
          <img
            src={currentUser && currentUser.photoURL}
            className={classes.profile}
          />
        </IconButton>
        <Menu
          style={{ marginTop: "50px" }}
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          <MenuItem onClick={handleLogout} component={Link} to="/">
            Sign Out
          </MenuItem>
          <MenuItem onClick={() => setAnchorEl(null)}>Profile</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
// export withRouter(NavAppBar);
export default App;
