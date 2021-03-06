import React from "react";
import { Meteor } from "meteor/meteor";

import Avatar from "@material-ui/core/Avatar";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Badge from "@material-ui/core/Badge";

import { makeStyles } from "@material-ui/core/styles";

import ChannelIcon from "./ChannelIcon";

const useStyles = makeStyles(theme => ({
  chip: {
    marginTop: "-16px"
  }
}));

function differMessages(readMessages, messagesCount) {
  const userReadMessages = (readMessages || []).find(item => item.userId === Meteor.userId());

  const differ = messagesCount - ((userReadMessages || {}).count || 0);

  return differ || 0;
}

function showUnreadMessages(differ, classes) {
  if (differ > 0) {
    return <Badge badgeContent={differ} color="primary" />;
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

  return (
    <ListItem button selected={selected} onClick={onClick}>
      <ListItemAvatar>
        <Avatar alt={name} src={avatar}>
          A
        </Avatar>
      </ListItemAvatar>
      <ListItemText primary={name} secondary={lastMessageTrimmed} />
      <ListItemSecondaryAction>
        <ChannelIcon channel={channel} />
        {showUnreadMessages(differ, classes)}
      </ListItemSecondaryAction>
    </ListItem>
  );
}
