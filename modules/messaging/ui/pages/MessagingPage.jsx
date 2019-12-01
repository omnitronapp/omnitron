import React, { useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import { Grid, Divider, Box } from "@material-ui/core";

import ContactSearch from "../../../contacts/ui/components/ContactSearch";
import ContactsList from "../../../contacts/ui/components/ContactsList";
import ChatLayout from "./ChatLayout";

const useStyles = makeStyles(theme => ({
  root: {
    height: "100%"
  },
  messagesGrid: {
    height: "100%",
    overflow: "hidden"
  },
  contactsGrid: {
    height: "100%"
  }
}));

export default function MessagingPage() {
  const [currentContactId, setContactId] = useState(null);
  const [searchContact, setSearchContact] = useState("");

  function onContactSelect(contactId) {
    setContactId(contactId);
  }

  const onSearchContact = function(text) {
    setSearchContact(text);
    setContactId(null);
  };

  const classes = useStyles();

  return (
    <>
      <Grid container className={classes.root} justify="center" spacing={0}>
        <Grid item xs={4} className={classes.contactsGrid}>
          <Box height="calc(100% - 50px)">
            <ContactSearch searchContact={searchContact} onSearchContact={onSearchContact} />
            <Divider />
            <ContactsList
              searchContact={searchContact}
              contactId={currentContactId}
              onContactSelect={onContactSelect}
            />
          </Box>
        </Grid>
        <Grid item xs={8} className={classes.messagesGrid}>
          <ChatLayout contactId={currentContactId} />
        </Grid>
      </Grid>
    </>
  );
}
