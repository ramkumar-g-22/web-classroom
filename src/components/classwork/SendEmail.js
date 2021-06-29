import React from "react";
import Button from "@material-ui/core/Button";
import emailjs from "emailjs-com";
import { useAuth } from "../../context/AuthContext";
import { makeStyles } from "@material-ui/core";
import { Link, useParams } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  webContainer: {
    display: "flex",
    width: "100%",
    height: "40%",
    backgroundColor: "grey",
    color: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  web: {
    fontSize: "1.5rem",
  },
  content: {
    margin: "2rem",
  },
}));

const SERVICE_ID = "service_gmail";
const TEMPLATE_ID = "material_template";
const USER_ID = "user_HDBrQ37Y4hjplMK9qg4NS";

// function sendEmail() {
//   emailjs.send(SERVICE_ID, TEMPLATE_ID, materialTemplateParams, USER_ID).then(
//     function (response) {
//       console.log("SUCCESS!", response.status, response.text);
//     },
//     function (error) {
//       console.log("FAILED...", error);
//     }
//   );
// }

function SendEmail({ title, materialUrl }) {
  const classes = useStyles();
  const { currentUser } = useAuth();
  const from_name = currentUser.displayName;
  const to_name = "Ram";
  const materialTemplateParams = {
    from_name: currentUser.displayName,
    to_name: "Ram",
    title,
    materialUrl,
  };

  return (
    <>
      <div className={classes.webContainer}>
        <div className={classes.web}>Web Classroom</div>
      </div>
      <div className={classes.content}>
        <h2>Hi {to_name},</h2>
        <br />
        <div>{from_name} posted a new announcement.</div>
        <div>
          <h2>{title}</h2>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to={materialUrl}
          >
            Open
          </Button>
        </div>
      </div>
    </>
  );
}

export default SendEmail;
