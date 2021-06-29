import React, { useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { provider } from "../../firebase/firebase";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
// import Link  from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import google from "../../assets/google.jpg";
import background from "../../assets/background.jpg";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(4),
    width: "30%",
    backgroundColor: "#f1f1f1",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    borderRadius: "6px",
    position: "absolute",
    top: "12%",
    right: "10%",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.dark,
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  link: {
    marginLeft: theme.spacing(12.5),
    color: theme.palette.primary.dark,
    textDecoration: "none",
    fontWeight: "bold",
  },
  container: {
    width: "100vw",
    height: "100vh",
    position: "relative",
  },
}));

function SignUp() {
  const classes = useStyles();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signUp, signInWithGoogle } = useAuth(); // Directly pointing out the signUp() from context
  const history = useHistory();

  function handleEmail(e) {
    e.preventDefault();
    setEmail(e.target.value);
  }
  function handlePassword(e) {
    e.preventDefault();
    setPassword(e.target.value);
  }

  async function handleSignInWithGoogle(e) {
    e.preventDefault();
    try {
      await signInWithGoogle(provider);
      history.push("/");
    } catch (error) {
      console.log("Login Error: ", error);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      // await signUp(emailRef.current.value, passwordRef.current.value);
      await signUp(email.target.value, password.target.value);
      history.push("/login");
    } catch (error) {
      console.log("SignUp Error: ", error);
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />

      <div className={classes.container}>
        <img src={background} className={classes.container} />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            {/* <LockOutlinedIcon /> */}
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign Up
          </Typography>
          <form className={classes.form} onSubmit={handleSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={email}
              onChange={handleEmail}
              autoFocus
            />
            <TextField
              value={password}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              onChange={handlePassword}
              autoComplete="current-password"
            />
            {/* <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          /> */}
            <Button
              type="submit"
              fullWidth
              variant="outlined"
              color="primary"
              // disabled={!(email && password)}
              className={classes.submit}
              onClick={handleSubmit}
            >
              Sign Up
            </Button>
            <Button
              type="submit"
              fullWidth
              variant="outlined"
              color="primary"
              className={classes.submit}
              onClick={handleSignInWithGoogle}
            >
              <img
                src={google}
                style={{
                  width: "30px",
                  marginLeft: "10px",
                  marginRight: "20px",
                }}
              />
              Sign In With Google
            </Button>
            <Link to="/login" className={classes.link}>
              {"Already have an account? Sign In"}
            </Link>
          </form>
        </div>
      </div>
      {/* <Box mt={8} border={86} borderColor="grey.500" borderRadius="50%"></Box> */}
    </Container>
  );
}

export default SignUp;
