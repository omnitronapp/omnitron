import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import React from "react";
import moment from "moment";
import { makeStyles } from "@material-ui/core/styles";
import { Paper } from "@material-ui/core";
import { MessagesCollection } from "../../../messages/collections";
import MessageGroup from "../components/MessageGroup";
import _ from "underscore";

const useStyles = makeStyles(theme => ({
  root: {
    flex: 1,
    width: "100%",
    overflowX: "hidden",
    overflowY: "auto",
    background: "none"
  }
}));

function ChatWindow({ messages, dividedMessages }) {
  const classes = useStyles();

  return (
    <Paper square elevation={0} className={classes.root}>
      {dividedMessages.map(messages => {
        const createdAt = messages[0].createdAt;
        const date = moment(createdAt).format("dddd, MMM DD, YYYY");
        return <MessageGroup key={date} messages={messages} date={date} />;
      })}
    </Paper>
  );
}

export default withTracker(({ contactId }) => {
  const subHandler = Meteor.subscribe("messages", { contactId });
  const messages = MessagesCollection.find({}, { sort: { createdAt: 1 } }).fetch();

  let dateGroups = _.chain(messages)
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
    dividedMessages: dateGroups
  };
})(ChatWindow);
