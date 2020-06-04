import { Meteor } from "meteor/meteor";
import React from "react";
import moment from "moment";
import classnames from "classnames";
import { toast } from "react-toastify";

import ListItem from "@material-ui/core/ListItem";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";

import DeleteIcon from "@material-ui/icons/Delete";
import ReplayIcon from "@material-ui/icons/Replay";

import { makeStyles } from "@material-ui/core/styles";

import PlainMessage from "./messageTypes/PlainMessage";
import ImageRenderer from "./messageTypes/ImageRenderer";
import DocumentRenderer from "./messageTypes/DocumentRenderer";
import AudioRenderer from "./messageTypes/AudioRenderer";
import VideoRenderer from "./messageTypes/VideoRenderer";

import MessageStatus from "./MessageStatus";

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
  cardErrorMessage: {
    backgroundColor: theme.palette.error.light
  },
  chunkErrorMessage: {
    borderColor: `transparent transparent transparent ${theme.palette.error.light} !important`
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

  const cardClassNames = classnames(
    inbound ? classes.cardInbound : classes.cardOutbound,
    message.status === "error" ? classes.cardErrorMessage : null
  );
  const chunkClassNames = classnames(
    inbound ? classes.chunkInbound : classes.chunkOutbound,
    message.status === "error" ? classes.chunkErrorMessage : null
  );

  function onResendMessage() {
    Meteor.call("resendMessage", message._id, err => {
      if (err) {
        return toast.success(`Failed to resent the message ${err.message}`);
      }
      toast.success("Message was resent");
    });
  }

  function onRemoveMessage() {
    Meteor.call("removeMessage", message._id, err => {
      if (err) {
        return toast.success(`Failed to remove the message ${err.message}`);
      }
      toast.success("Message was removed");
    });
  }

  return (
    <Grid
      container
      className={classes.root}
      spacing={0}
      wrap="wrap"
      alignItems="flex-start"
      justify={inbound ? "flex-start" : "flex-end"}
    >
      <div className={cardClassNames}>
        <div className={chunkClassNames} />
        <ListItem className={classes.item}>
          <Grid item xs>
            <MessageRenderer message={message} />
          </Grid>
          <Grid item className={classes.time}>
            <Typography variant="caption" align="center">
              {moment(message.createdAt).format("HH:mm:ss")}
            </Typography>
          </Grid>
          {!inbound && message.status !== "error" ? (
            <Grid item className={classes.time}>
              <MessageStatus status={message.status} />
            </Grid>
          ) : null}
          {message.status === "error" ? (
            <>
              <IconButton aria-label="Resend Message" color="primary" onClick={onResendMessage}>
                <ReplayIcon />
              </IconButton>
              <IconButton aria-label="Remove Message" color="primary" onClick={onRemoveMessage}>
                <DeleteIcon />
              </IconButton>
            </>
          ) : null}
        </ListItem>
      </div>
    </Grid>
  );
}
