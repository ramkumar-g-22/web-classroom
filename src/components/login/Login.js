import React, { useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { provider } from "../../firebase/firebase";
import google from "../../assets/google.jpg";
import background from "../../assets/background.jpg";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

const useStyles = makeStyles((theme) => ({
  container: {
    width: "100vw",
    height: "100vh",
    // backgroundImage: `url(${background})`,
    position: "relative",
  },
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
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  link: {
    marginLeft: theme.spacing(14),
    color: theme.palette.primary.dark,
    textDecoration: "none",
    // fontSize: "16px",
    fontWeight: "bold",
  },
}));

export default function Login() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const classes = useStyles();
  // console.log(classes);
  // const emailRef = useRef();
  // const passwordRef = useRef();
  const { login, signInWithGoogle } = useAuth(); // Directly pointing out the signUp() from context
  const history = useHistory();

  function handleEmail(e) {
    e.preventDefault();
    setEmail(e.target.value);
  }
  function handlePassword(e) {
    e.preventDefault();
    setPassword(e.target.value);
  }

  async function handleLogin(e) {
    e.preventDefault();
    try {
      // await login(emailRef.current.value, passwordRef.current.value);
      await login(email, password);
      history.push("/");
    } catch (error) {
      console.log("Login Error: ", error);
    }
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

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.container}>
        <img src={background} className={classes.container} />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form className={classes.form} onSubmit={handleLogin}>
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
              onClick={handleLogin}
            >
              Sign In
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
            <Link className={classes.link} to="/signup">
              {"Don't have an account? Sign Up"}
            </Link>
          </form>
        </div>
      </div>
      {/* <Box mt={8}></Box> */}
    </Container>
  );
}
