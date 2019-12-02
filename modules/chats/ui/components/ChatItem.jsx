import React from "react";

import { Avatar, ListItem, ListItemText, ListItemAvatar } from "@material-ui/core";

export default function ChatItem({
  _id,
  avatar,
  name,
  lastMessageTrimmed,
  selected,
  onChatSelect
}) {
  function onClick() {
    onChatSelect(_id);
  }

  return (
    <ListItem button selected={selected} onClick={onClick}>
      <ListItemAvatar>
        <Avatar alt={name} src={avatar}>
          A
        </Avatar>
      </ListItemAvatar>
      <ListItemText primary={name} secondary={lastMessageTrimmed} />
    </ListItem>
  );
}
