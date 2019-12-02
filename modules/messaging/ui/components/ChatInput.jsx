import { Meteor } from "meteor/meteor";

import React, { useState, Fragment } from "react";

import { makeStyles } from "@material-ui/core/styles";
import { Grid, TextField, IconButton } from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";

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
      />
      <Fragment>
        <IconButton onClick={sendMessage} disabled={text.trim().length === 0} color="primary">
          <SendIcon />
        </IconButton>
      </Fragment>
    </Grid>
  );
}
