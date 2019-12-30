import React from "react";

import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";

import { makeStyles } from "@material-ui/core/styles";

import ChatWindow from "./ChatWindow";
import ChatInput from "../ChatInput";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    height: "100%",
    overflow: "hidden",
    margin: 0,
    padding: 0
  },
  window: {
    width: "100%",
    height: "100%",
    overflow: "hidden",
    margin: 0,
    padding: 0
  },
  noChat: {
    display: "block",
    minWidth: "10px",
    padding: "4px 7px",
    lineHeight: 1.4,
    color: "#999",
    textAlign: "center",
    borderRadius: "10px",
    margin: "auto 0"
  }
}));

export default function ChatLayout({ chatId }) {
  const classes = useStyles();

  function showChat() {
    if (!chatId) {
      return (
        <Typography className={classes.noChat} component="h1" variant="h5">
          Select a chat
        </Typography>
      );
    } else {
      return (
        <>
          <ChatWindow key="chat" chatId={chatId} />
          <ChatInput key="input" chatId={chatId} />
        </>
      );
    }
  }

  return (
    <Grid container className={classes.root} spacing={0} wrap="nowrap">
      <Grid item xs>
        <Grid container direction="column" className={classes.window} spacing={0} wrap="nowrap">
          {showChat()}
        </Grid>
      </Grid>
    </Grid>
  );
}
