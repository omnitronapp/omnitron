import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import React, { useEffect, useRef, useState } from "react";
import moment from "moment";
import _ from "underscore";

import { Paper, makeStyles } from "@material-ui/core";

import { MessagesCollection, ChatsCollection } from "../../../collections";
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

function ChatWindow({
  groupedMessages,
  ready,
  chat,
  chatId,
  options,
  changeLimit,
  messagesLength
}) {
  const classes = useStyles();

  const chatPaperRef = useRef(null);

  const [scrollToBottom, setScrollToBottom] = useState(true);

  function scrollPaper() {
    if (chatPaperRef && chatPaperRef.current) {
      if (scrollToBottom) {
        chatPaperRef.current.scrollTop =
          chatPaperRef.current.scrollHeight - chatPaperRef.current.clientHeight;
      }
    }
  }

  useEffect(
    () => {
      if (ready) {
        Meteor.call("setReadMessages", chatId);
        scrollPaper();

        if (!scrollToBottom) {
          const newScrollTop =
            chatPaperRef.current.scrollHeight - this.beforeScrollHeight + this.beforeScrollTop;

          chatPaperRef.current.scrollTop = newScrollTop;
        }
      }
    },
    [chat.messagesCount, ready]
  );

  // scroll to the bottom when chat opened
  useEffect(
    () => {
      scrollPaper();
    },
    [chatId]
  );

  function onScroll(event) {
    const { target } = event;

    const userScrollToBottom =
      Math.abs(target.scrollHeight - target.scrollTop - target.clientHeight) <= 3.0;

    if (scrollToBottom !== userScrollToBottom) {
      setScrollToBottom(userScrollToBottom);
    }

    if (target.scrollTop === 0 && messagesLength < chat.messagesCount) {
      this.beforeScrollHeight = target.scrollHeight;
      this.beforeScrollTop = target.scrollTop;
      changeLimit(options.limit + 30);
    }
  }

  return (
    <Paper square elevation={0} className={classes.root} onScroll={onScroll} ref={chatPaperRef}>
      {groupedMessages.map(messages => {
        const createdAt = messages[0].createdAt;
        const date = moment(createdAt).format("dddd, MMM DD, YYYY");
        return <MessageGroup key={date} messages={messages} date={date} />;
      })}
    </Paper>
  );
}

export default withTracker(({ chatId, options }) => {
  const { limit } = options;
  const subHandler = Meteor.subscribe("messages", { chatId, limit });
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
    groupedMessages: messageGroupsByDate,
    chat: ChatsCollection.findOne({ _id: chatId }),
    messagesLength: messages.length
  };
})(ChatWindow);
