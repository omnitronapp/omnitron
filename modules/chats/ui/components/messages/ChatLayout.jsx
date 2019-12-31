import React from "react";

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
  }
}));

export default function ChatLayout({ chatId, options, changeLimit }) {
  const classes = useStyles();

  return (
    <Grid container className={classes.root} spacing={0} wrap="nowrap">
      <Grid item xs>
        <Grid container direction="column" className={classes.window} spacing={0} wrap="nowrap">
          <ChatWindow changeLimit={changeLimit} options={options} key="chat" chatId={chatId} />
          <ChatInput key="input" chatId={chatId} />
        </Grid>
      </Grid>
    </Grid>
  );
}
