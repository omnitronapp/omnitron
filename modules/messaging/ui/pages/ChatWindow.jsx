import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import React from "react";
import moment from "moment";
import { makeStyles } from "@material-ui/core/styles";
import { Paper } from "@material-ui/core";
import { MessagesCollection } from "../../../messages/collections";
import MessageGroup from "../components/MessageGroup";

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
  const messages = MessagesCollection.find().fetch();

  let result = [];
  let lastDate = null;

  messages.reduce(function(p, c, i, a) {
    const date = new Date(c.createdAt);
    const isSameDate = moment(lastDate).isSame(date, "day");
    if (!(lastDate === null || isSameDate)) {
      result.push(p);
      p = [];
    }
    p.push(c);
    if (i === a.length - 1 && p.length > 0) {
      result.push(p);
    }
    lastDate = date;
    return p;
  }, []);

  return {
    messages,
    ready: subHandler.ready(),
    dividedMessages: result
  };
})(ChatWindow);
