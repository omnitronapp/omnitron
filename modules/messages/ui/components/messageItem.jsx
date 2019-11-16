import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles(theme => ({
  root: {
    overflowWrap: "break-word"
  }
}));

export default function MessageItem({ _id, message }) {
  const classes = useStyles();

  return (
    <ListItem className={classes.root} alignItems="center" button>
      <ListItemText secondary={message} />
    </ListItem>
  );
}
