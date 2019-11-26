import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { Grid } from "@material-ui/core";
import ChatWindow from "./ChatWindow";
import ChatInput from "../components/ChatInput";

const useStyles = makeStyles(theme => ({
  toolbar: theme.mixins.toolbar,
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

export default function ChatLayout({ contactId }) {
  const classes = useStyles();

  function showChat() {
    if (!contactId) {
      return (
        <Typography className={classes.noChat} component="h1" variant="h5">
          Выберите чат
        </Typography>
      );
    } else {
      return [
        <ChatWindow key="chat" contactId={contactId} />,
        <ChatInput key="input" contactId={contactId} />
      ];
    }
  }

  return (
    <Grid container className={classes.root} spacing={0} wrap="nowrap">
      <Grid item xs>
        <Grid container direction="column" className={classes.window} spacing={0} wrap="nowrap">
          <div className={classes.toolbar} />
          {showChat()}
        </Grid>
      </Grid>
    </Grid>
  );
}
