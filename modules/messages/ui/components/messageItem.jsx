import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";

export default function MessageItem({ _id, message }) {
  return (
    <ListItem alignItems="flex-start" button>
      <ListItemText secondary={message} />
    </ListItem>
  );
}
