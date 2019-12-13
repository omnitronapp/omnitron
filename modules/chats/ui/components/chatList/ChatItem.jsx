import React from "react";

import {
  Avatar,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction
} from "@material-ui/core";
import { WhatsApp, Telegram } from "@material-ui/icons";

function getChannelIcon(channel) {
  if (channel === "whatsapp") {
    return WhatsApp;
  } else if (channel === "telegram") {
    return Telegram;
  }

  return null;
}

export default function ChatItem({
  _id,
  avatar,
  name,
  lastMessageTrimmed,
  selected,
  channel,
  onChatSelect
}) {
  function onClick() {
    onChatSelect(_id);
  }

  const ChannelIcon = getChannelIcon(channel);

  return (
    <ListItem button selected={selected} onClick={onClick}>
      <ListItemAvatar>
        <Avatar alt={name} src={avatar}>
          A
        </Avatar>
      </ListItemAvatar>
      <ListItemText primary={name} secondary={lastMessageTrimmed} />
      <ListItemSecondaryAction>
        <ChannelIcon />
      </ListItemSecondaryAction>
    </ListItem>
  );
}
