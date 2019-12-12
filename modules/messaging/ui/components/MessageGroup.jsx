import React from "react";
import moment from "moment";

import { Typography, makeStyles } from "@material-ui/core";

import ChatMessage from "./ChatMessage";

const useStyles = makeStyles(theme => ({
  date: {
    display: "block",
    minWidth: "10px",
    padding: "4px 7px",
    lineHeight: 1.4,
    color: "#999",
    textAlign: "center",
    borderRadius: "10px",
    margin: "5px 0"
  }
}));

export default function MessageGroup({ messages, date }) {
  const classes = useStyles();

  let showDate = moment(new Date()).isSame(date, "day") ? "Today" : date;

  return (
    <div>
      <Typography className={classes.date} variant="overline" display="block" gutterBottom>
        {showDate}
      </Typography>
      {messages.map(message => {
        return <ChatMessage key={message._id} message={message} />;
      })}
    </div>
  );
}
