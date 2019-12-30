import React from "react";
import moment from "moment";

import Paper from "@material-ui/core/Paper";
import ListItem from "@material-ui/core/ListItem";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

import { makeStyles } from "@material-ui/core/styles";

import PlainMessage from "./messageTypes/PlainMessage";
import ImageRenderer from "./messageTypes/ImageRenderer";
import DocumentRenderer from "./messageTypes/DocumentRenderer";
import AudioRenderer from "./messageTypes/AudioRenderer";
import VideoRenderer from "./messageTypes/VideoRenderer";

const useStyles = makeStyles(theme => ({
  root: {
    padding: `${theme.spacing(1)}px ${theme.spacing(3)}px`,
    margin: 0,
    width: "100%"
  },
  cardInbound: {
    maxWidth: theme.spacing(50),
    position: "relative",
    backgroundColor: "#e3f2fd"
  },
  cardOutbound: {
    maxWidth: theme.spacing(50),
    position: "relative",
    backgroundColor: "#e3f2fd"
  },
  chunkInbound: {
    position: "absolute",
    left: -2 * theme.spacing(1) + 2,
    bottom: 0,
    borderRadius: 0,
    background: "transparent",
    borderStyle: "solid",
    borderWidth: `0 0 ${theme.spacing(2)}px ${theme.spacing(2)}px`,
    borderColor: `transparent transparent #e3f2fd transparent`
  },
  chunkOutbound: {
    position: "absolute",
    right: -2 * theme.spacing(1) + 2,
    bottom: 0,
    borderRadius: 0,
    background: "transparent",
    borderStyle: "solid",
    borderWidth: `${theme.spacing(2)}px 0 0 ${theme.spacing(2)}px`,
    borderColor: `transparent transparent transparent #e3f2fd`
  },
  time: {
    alignSelf: "flex-end",
    color: "#adadad",
    fontSize: ".85em",
    padding: "0 0 0 20px"
  }
}));

function getMessageRenderer(type) {
  if (type === "image") {
    return ImageRenderer;
  } else if (type === "document") {
    return DocumentRenderer;
  } else if (type === "voice") {
    return AudioRenderer;
  } else if (type === "video") {
    return VideoRenderer;
  }

  return PlainMessage;
}

export default function ChatMessages({ message }) {
  const classes = useStyles();

  const { inbound } = message;

  const MessageRenderer = getMessageRenderer(message.type);

  return (
    <Grid
      container
      className={classes.root}
      spacing={0}
      wrap="wrap"
      alignItems="flex-start"
      justify={inbound ? "flex-start" : "flex-end"}
    >
      <Paper elevation={0} className={inbound ? classes.cardInbound : classes.cardOutbound}>
        <Paper elevation={0} className={inbound ? classes.chunkInbound : classes.chunkOutbound} />
        <ListItem className={classes.item}>
          <Grid item xs>
            <MessageRenderer message={message} />
          </Grid>
          <Grid item className={classes.time}>
            <Typography variant="caption" align="center">
              {moment(message.createdAt).format("HH:mm:ss")}
            </Typography>
          </Grid>
        </ListItem>
      </Paper>
    </Grid>
  );
}
