import { Meteor } from "meteor/meteor";

import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Grid, Paper } from "@material-ui/core";

import ContactsList from "../../../contacts/ui/components/contactsList";
import MessagesList from "../../../messages/ui/components/messagesList";
import MessageInput from "../components/MessageInput";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    maxWidth: "1010px",
    minWidth: "300px",
    margin: "0 auto",
    overflow: "hidden"
  }
}));

export default function MessagingPage() {
  const [currentContactId, setContactId] = useState();

  function onContactSelect(contactId) {
    setContactId(contactId);
  }

  function sendMessage(message) {
    Meteor.call("createMessage", {
      contactId: currentContactId,
      message
    });
  }

  const classes = useStyles();

  return (
    <Box>
      <Paper className={classes.root}>
        <Grid container spacing={0}>
          <Grid item xs={12}>
            <Grid container justify="center" spacing={1}>
              <Grid key="contacts-list" item xs={4}>
                <ContactsList contactId={currentContactId} onContactSelect={onContactSelect} />
              </Grid>
              <Grid key="messaging-panel" item xs={8}>
                <Grid
                  container
                  className={classes.root}
                  spacing={0}
                  direction="column"
                  justify="flex-end"
                >
                  <Grid key="messages-list" item xs={12}>
                    <MessagesList contactId={currentContactId} />
                  </Grid>
                  <Grid key="messages-input" item xs={12}>
                    <MessageInput sendMessage={sendMessage} />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
