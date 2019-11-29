import React from "react";
import moment from "moment";
import { makeStyles } from "@material-ui/core/styles";
import { Paper, ListItem, Grid, Typography } from "@material-ui/core";

import PlainMessage from "./messageTypes/PlainMessage";
import PhotoRenderer from "./messageTypes/PhotoRenderer";

const useStyles = makeStyles(theme => ({
  root: {
    padding: `${theme.spacing(1)}px ${theme.spacing(3)}px`,
    margin: 0,
    width: "100%"
  },
  cardInbound: {
    maxWidth: theme.spacing(45),
    position: "relative",
    backgroundColor: "#e3f2fd"
  },
  cardOutbound: {
    maxWidth: theme.spacing(45),
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
  if (type === "photo") {
    return PhotoRenderer;
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
