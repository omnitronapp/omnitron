import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";

import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import MessageItem from "./messageItem";

import { MessagesCollection } from "../../collections";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper
  },
  inline: {
    display: "inline"
  }
}));

function MessagesList({ messages }) {
  const classes = useStyles();

  const messagesRender = messages.map(message => {
    return <MessageItem {...message} />;
  });

  return <List className={classes.root}>{messagesRender}</List>;
}

export default withTracker(({ contactId }) => {
  const subHandler = Meteor.subscribe("messages", { contactId });
  const messages = MessagesCollection.find().fetch();

  return {
    messages,
    ready: subHandler.ready()
  };
})(MessagesList);
