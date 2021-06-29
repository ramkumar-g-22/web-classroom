import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useParams } from "react-router-dom";
import { database } from "../../firebase/firebase";
import AddIcon from "@material-ui/icons/Add";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  addBtn: {
    "&:hover": {
      color: "white",
      backgroundColor: "grey",
    },
  },
}));

function AddTopic() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const { teachingClassName } = useParams();
  // console.log("teachingClassName : ", teachingClassName);

  const handleAddButton = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddTopic = () => {
    const teachingClassNameRef = database.ref(teachingClassName);
    const addTopicListRef = teachingClassNameRef.child(
      "/Classwork" + "/Topic List"
    );
    addTopicListRef.push(value);
    setValue("");
    setOpen(false);
  };

  return (
    <div>
      <Button
        startIcon={<AddIcon />}
        variant="outlined"
        // color="black"
        onClick={handleAddButton}
        className={classes.addBtn}
      >
        Topic
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Add Topic</DialogTitle>
        <DialogContent>
          {/* <DialogContentText>
            To subscribe to this website, please enter your email address here.
            We will send updates occasionally.
          </DialogContentText> */}
          <TextField
            autoFocus
            onChange={(e) => setValue(e.target.value)}
            variant="filled"
            margin="dense"
            id="classname"
            label="Topic"
            type="text"
            value={value}
            fullWidth
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddTopic} color="primary" disabled={!value}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AddTopic;
