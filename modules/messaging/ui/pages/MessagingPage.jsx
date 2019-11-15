import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

import ContactsList from "../../../contacts/ui/components/contactsList";
import MessagesList from "../../../messages/ui/components/messagesList";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    height: 140,
    width: 100
  },
  control: {
    padding: theme.spacing(2)
  }
}));

export default function MessagingPage() {
  const [currentContactId, setContactId] = useState();

  function onContactSelect(contactId) {
    setContactId(contactId);
  }

  const classes = useStyles();

  return (
    <Grid container className={classes.root} spacing={2}>
      <Grid item xs={12}>
        <Grid container justify="center" spacing={0}>
          <Grid key="contacts-list" item xs={4}>
            <ContactsList contactId={currentContactId} onContactSelect={onContactSelect} />
          </Grid>
          <Grid key="messages-list" item xs={8}>
            <MessagesList contactId={currentContactId} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
