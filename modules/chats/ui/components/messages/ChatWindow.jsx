import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import React from "react";
import moment from "moment";
import _ from "underscore";

import { Paper, makeStyles } from "@material-ui/core";

import { MessagesCollection } from "../../../collections";
import MessageGroup from "./MessageGroup";

const useStyles = makeStyles(theme => ({
  root: {
    flex: 1,
    width: "100%",
    overflowX: "hidden",
    overflowY: "auto",
    background: "none"
  }
}));

function ChatWindow({ groupedMessages }) {
  const classes = useStyles();

  return (
    <Paper square elevation={0} className={classes.root}>
      {groupedMessages.map(messages => {
        const createdAt = messages[0].createdAt;
        const date = moment(createdAt).format("dddd, MMM DD, YYYY");
        return <MessageGroup key={date} messages={messages} date={date} />;
      })}
    </Paper>
  );
}

export default withTracker(({ chatId }) => {
  const subHandler = Meteor.subscribe("messages", { chatId });
  const messages = MessagesCollection.find({}, { sort: { createdAt: 1 } }).fetch();

  let messageGroupsByDate = _.chain(messages)
    .groupBy(function(obj) {
      return moment(obj.createdAt).format("DD.MM.YYYY");
    })
    .sortBy(function(messageGroup) {
      return messageGroup[0].createdAt;
    })
    .value();

  return {
    messages,
    ready: subHandler.ready(),
    groupedMessages: messageGroupsByDate
  };
})(ChatWindow);
