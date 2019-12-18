import React from "react";
import { Meteor } from "meteor/meteor";

import {
  Avatar,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Chip,
  makeStyles
} from "@material-ui/core";
import { WhatsApp, Telegram } from "@material-ui/icons";

const useStyles = makeStyles(theme => ({
  chip: {
    marginTop: "-16px"
  }
}));

function differMessages(readMessages, messagesCount) {
  const userReadMessages = readMessages.find(item => item.userId === Meteor.userId());

  const differ = messagesCount - ((userReadMessages || {}).count || 0);

  return differ || 0;
}

function getChannelIcon(channel) {
  if (channel === "whatsapp") {
    return WhatsApp;
  } else if (channel === "telegram") {
    return Telegram;
  }

  return null;
}

function showUnreadMessages(differ, classes) {
  if (differ > 0) {
    return <Chip className={classes.chip} size="small" label={differ} />;
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
  onChatSelect,
  messagesCount,
  readMessages
}) {
  const classes = useStyles();
  const differ = differMessages(readMessages, messagesCount);

  function onClick() {
    onChatSelect(_id);

    if (differ > 0) Meteor.call("setReadMessages", _id);
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
        {showUnreadMessages(differ, classes)}
      </ListItemSecondaryAction>
    </ListItem>
  );
}
