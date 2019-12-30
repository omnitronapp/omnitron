import { Meteor } from "meteor/meteor";

import React, { useState } from "react";

import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";

import Send from "@material-ui/icons/Send";

const useStyles = makeStyles(theme => ({
  grid: {
    margin: 0,
    padding: theme.spacing(1),
    borderTop: "1px solid #e0e0e0"
  },
  input: {
    paddingLeft: theme.spacing(1)
  }
}));

export default function ChatInput({ chatId }) {
  const [text, setText] = useState("");

  function sendMessage() {
    Meteor.call(
      "createMessage",
      {
        chatId,
        message: text
      },
      (err, res) => {
        setText("");
      }
    );
  }

  function onKeyDown(event) {
    if (event.ctrlKey && event.keyCode === 13) {
      sendMessage();
    }
  }

  function onInputChange(event) {
    setText(event.target.value);
  }

  const classes = useStyles();

  return (
    <Grid container spacing={0} alignItems="center" className={classes.grid} wrap="nowrap">
      <TextField
        multiline
        autoFocus
        fullWidth
        value={text}
        placeholder="Message text..."
        InputProps={{ disableUnderline: true }}
        className={classes.input}
        onChange={onInputChange}
        onKeyDown={onKeyDown}
      />
      <IconButton onClick={sendMessage} disabled={text.trim().length === 0} color="primary">
        <Send />
      </IconButton>
    </Grid>
  );
}
