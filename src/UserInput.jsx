import React, { useEffect, useState } from "react";
import {
  Grid,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import { updateJsonFile } from "./utility";

const UserInput = (props) => {
  const {
      open,
      setOpen,
      userJson,
      userJsonFile,
      rowToCheck,
      setUserJson,
      idClickedOn,
    } = props,
    { output, issuenr, id, col2 } = rowToCheck,
    [comment, setComment] = useState(""),
    [user, setUser] = useState(localStorage.getItem("user") || ""),
    // handleChange = (e, key, field, id) => {
    //   // eslint-disable-next-line
    //   const obj = eval(key);
    //   console.log(e, key, obj, id);
    //   obj[id][field] = e.target.value;
    //   obj[id].ok = e.target.value ? true : false;
    // },
    handleClose = () => {
      setOpen(false);
    },
    approve = (ok) => {
      // save choice the user made to a corresponding JSON file on server
      console.log("saving ", userJsonFile, "comment:", comment);
      // create some JSON that we can specifically tie to this report, perhaps with date/time/directory
      const newContent = {
        output: output,
        issuenr: issuenr,
        col2: col2,
        id: id,
        ok: ok,
        user: user,
        comment: comment,
        datetime: new Date().toUTCString(),
      };
      console.log(
        "userJson",
        userJson,
        "userJsonFile",
        userJsonFile,
        "rowToCheck",
        rowToCheck,
        "user",
        user,
        "newContent",
        newContent
      );
      if (ok) localStorage.setItem("user", user);
      const allButNew = userJson ? userJson.filter((row) => row.id !== id) : [],
        newJsonContent = [...allButNew, newContent];
      console.log("newJsonContent", newJsonContent);
      setUserJson(newJsonContent);
      updateJsonFile(userJsonFile, newJsonContent);
      setOpen(false);
    };

  useEffect(() => {
    if (!userJson) return;
    const idToUse = userJson.filter((row) => row.id === idClickedOn);
    if (idToUse && idToUse[0]) {
      // console.log(idToUse[0].comment, idToUse[0].user);
      setComment(idToUse[0].comment || comment);
      setUser(idToUse[0].user || user);
    }
    // eslint-disable-next-line
  }, [userJson]);

  return (
    <React.Fragment>
      <Dialog
        fullWidth={true}
        maxWidth={"sd"}
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>Approve a message (if OK)</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 3 }}>
            Enter a comment if the line is considered OK.
          </DialogContentText>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Message"
                value={col2}
                disabled={true}
                sx={{ width: "100%" }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Comment"
                value={comment}
                onChange={(e) => {
                  setComment(e.target.value);
                }}
                sx={{ width: "100%" }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="User ID"
                value={user}
                onChange={(e) => {
                  setUser(e.target.value);
                }}
                sx={{ width: "100%" }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => approve(false)}
            variant={"contained"}
            color={"error"}
          >
            Not OK
          </Button>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={() => {
              approve(true);
            }}
            variant={"contained"}
            color={"success"}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default UserInput;
