import React, { useState } from "react";
import { Meteor } from "meteor/meteor";
import { Grid, Divider, Box, makeStyles } from "@material-ui/core";

import ChatSearch from "../components/ChatSearch";
import ChatsListWrapper from "../components/chatList/ChatsListWrapper";
import ChatLayout from "../components/messages/ChatLayout";

const useStyles = makeStyles(theme => ({
  root: {
    height: "100%"
  },
  messagesGrid: {
    height: "100%",
    overflow: "hidden"
  },
  chatsGrid: {
    height: "100%"
  }
}));

export default function ChatsPage() {
  const [currentChatId, setChatId] = useState(null);
  const [searchChat, setSearchChat] = useState("");
  const [options, setOptions] = useState({
    limit: 20,
    page: 0
  });

  function onChatSelect(chatId) {
    setChatId(chatId);
    setOptions({
      limit: 20,
      page: 1
    });
  }

  const onChatSearch = function(text) {
    setSearchChat(text);
    setChatId(null);
  };

  function changeLimit(page) {
    setOptions({
      ...options,
      page
    });
  }

  const classes = useStyles();

  return (
    <Grid container className={classes.root} justify="center" spacing={0}>
      <Grid item xs={4} className={classes.chatsGrid}>
        <Box height="calc(100% - 50px)">
          <ChatSearch searchChat={searchChat} onChatSearch={onChatSearch} />
          <Divider />
          <ChatsListWrapper
            searchChat={searchChat}
            chatId={currentChatId}
            onChatSelect={onChatSelect}
          />
        </Box>
      </Grid>
      <Grid item xs={8} className={classes.messagesGrid}>
        <ChatLayout changeLimit={changeLimit} options={options} chatId={currentChatId} />
      </Grid>
    </Grid>
  );
}
