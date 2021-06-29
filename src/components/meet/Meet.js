import { makeStyles } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import AssignmentIcon from "@material-ui/icons/Assignment";
import PhoneIcon from "@material-ui/icons/Phone";
import React, { useEffect, useRef, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useParams } from "react-router";
import Peer from "simple-peer";
import io from "socket.io-client";
import { useAuth } from "../../context/AuthContext";
import { database } from "../../firebase/firebase";
import TeachingClassroom from "../TeachingClassroom";

const socket = io.connect("http://localhost:5000");

const useStyles = makeStyles((theme) => ({
  container: {
    display: "grid",
    gridTemplateColumns: "7fr 3fr",
  },

  myId: {
    marginRight: "5rem",
    borderRadius: "5px",
    background: "#c9d6ff",
    padding: "2rem",
    display: "grid",
    justifyContent: "center",
    alignContent: "center",
    marginTop: "1rem",
  },

  callButton: {
    textAlign: "center",
    marginTop: "2rem",
  },

  videoContainer: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    justifyContent: "center",
    alignContent: "center",
    marginTop: "10rem",
    marginLeft: "10rem",
  },

  caller: {
    textAlign: "center",
    color: "blue",
  },
}));

function Meet() {
  const { currentUser } = useAuth();
  const classes = useStyles();
  const [receivingCall, setReceivingCall] = useState(false);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [caller, setCaller] = useState("");
  const [stream, setStream] = useState();
  const [me, setMe] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [idToCall, setIdToCall] = useState("");
  const [name, setName] = useState("");
  const myVideo = useRef();
  const connectionRef = useRef();
  const userVideo = useRef();
  const { teachingClassName } = useParams();

  const teachingClassNameRef = database.ref(teachingClassName);
  const meetIdRef = teachingClassNameRef.child("/Meet" + "/MeetId");
  const meetFromRef = teachingClassNameRef.child("/Meet" + "/MeetFrom");
  const meetNameRef = teachingClassNameRef.child("/Meet" + "/MeetName");
  const meetSignalRef = teachingClassNameRef.child("/Meet" + "/MeetSignal");
  const meetStreamRef = teachingClassNameRef.child("/Meet" + "/MeetStream");

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        // console.log("Stream : ", stream);
        // meetStreamRef.set({ stream: stream });
        setStream(stream);
        // getStream();
        myVideo.current.srcObject = stream;
      });
    // This "me" event is emitted by the server
    socket.on("me", (id) => {
      // setMe(() => id);
      meetIdRef.set({ meetId: id });
      getMeetId();
    });

    // This "callUser" event is emitted by the server
    socket.on("callUser", (data) => {
      setReceivingCall(true);
      meetFromRef.set({ from: data.from });
      meetNameRef.set({ name: data.name });
      meetSignalRef.set({ signal: data.signal });
      // setCaller(data.from);
      // setName(data.name);
      // setCallerSignal(data.signal);
      getMeetDetails();
    });
  }, []);

  function getMeetDetails() {
    meetFromRef.on("value", (snap) => {
      setCaller(() => snap.val().from);
    });
    meetNameRef.on("value", (snap) => {
      setName(() => snap.val().name);
    });
    meetSignalRef.on("value", (snap) => {
      setCallerSignal(() => snap.val().signal);
    });
  }

  function getMeetId() {
    meetIdRef.on("value", (snap) => {
      setMe(() => snap.val().meetId);
    });
  }

  function getStream() {
    meetStreamRef.on("value", (snap) => {
      setStream(() => snap.val().stream);
    });
  }

  const callUser = (id) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", (data) => {
      //The client emitting the data to the server by "callUser" event
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: me,
        name: currentUser.email,
      });
    });
    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });

    // This "callAccepted" event is emitted by the server
    socket.on("callAccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, to: caller });
    });
    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    // connectionRef.current.destroy();
  };

  return (
    <>
      <TeachingClassroom />
      {/* <h1 style={{ textAlign: "center", color: "#fff" }}>Zoomish</h1> */}
      <div className={classes.container}>
        <div className={classes.videoContainer}>
          <div className={classes.video}>
            {stream && (
              <video
                playsInline
                muted
                ref={myVideo}
                autoPlay
                style={{ width: "300px" }}
              />
            )}
          </div>
          <div className={classes.video}>
            {callAccepted && !callEnded ? (
              <video
                playsInline
                ref={userVideo}
                autoPlay
                style={{ width: "300px" }}
              />
            ) : null}
          </div>
        </div>
        <div className={classes.myId}>
          <TextField
            id="filled-basic"
            label="Name"
            variant="filled"
            value={currentUser.email}
            defaultValue={currentUser.email}
            onChange={(e) => setName(e.target.value)}
            style={{ marginBottom: "20px" }}
          />
          <CopyToClipboard text={me} style={{ marginBottom: "2rem" }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AssignmentIcon fontSize="large" />}
            >
              Copy ID
            </Button>
          </CopyToClipboard>
          {/* <h3>{me}</h3> */}
          <TextField
            id="filled-basic"
            label="ID to call"
            variant="filled"
            value={idToCall}
            onChange={(e) => setIdToCall(e.target.value)}
          />
          <div className={classes.callButton}>
            {callAccepted && !callEnded ? (
              <Button variant="contained" color="secondary" onClick={leaveCall}>
                End Call
              </Button>
            ) : (
              <IconButton
                color="primary"
                aria-label="call"
                onClick={() => callUser(idToCall)}
              >
                <PhoneIcon fontSize="large" />
              </IconButton>
            )}
            {idToCall}
          </div>
        </div>
        <>
          {receivingCall && !callAccepted ? (
            <div className={classes.caller}>
              <h1>{name} is calling...</h1>
              <Button variant="contained" color="primary" onClick={answerCall}>
                Answer
              </Button>
            </div>
          ) : null}
        </>
      </div>
    </>
  );
}

export default Meet;
