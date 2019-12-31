import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";

import React from "react";
import InfiniteScroll from "react-infinite-scroller";

import List from "@material-ui/core/List";
import { makeStyles } from "@material-ui/core/styles";

import ChatItem from "./ChatItem";
import { ChatsCollection } from "../../../collections";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
    height: "100%",
    overflowY: "scroll"
  },
  inline: {
    display: "inline"
  }
}));

function ChatsList({ chats, chatId, ready, onChatSelect, incrementPage, page }) {
  const classes = useStyles();

  const chatsRender = chats.map(chat => {
    return (
      <ChatItem
        key={chat._id}
        {...chat}
        selected={chat._id === chatId}
        onChatSelect={onChatSelect}
      />
    );
  });

  const loadMore = function() {
    incrementPage(page);
  };

  return (
    <List className={classes.root}>
      <InfiniteScroll pageStart={page} loadMore={loadMore} hasMore={false}>
        {chatsRender}
      </InfiniteScroll>
    </List>
  );
}

export default withTracker(({ searchChat, page }) => {
  const options = {
    limit: page * 10,
    sort: {
      latestActiveDate: -1
    }
  };
  const subHandler = Meteor.subscribe("chats", searchChat, options);
  const chats = ChatsCollection.find({}, { sort: { latestActiveDate: -1 } }).fetch();

  return {
    chats,
    ready: subHandler.ready()
  };
})(ChatsList);
