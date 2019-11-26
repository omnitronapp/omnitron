import { Meteor } from "meteor/meteor";

import React, { useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { Grid } from "@material-ui/core";

import CustomDrawer from "../../../drawer/CustomDrawer";
import ContactsList from "../../../contacts/ui/components/contactsList";
import ChatLayout from "./ChatLayout";

const drawerWidth = "25%";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    height: "100vh"
  },
  appBar: {
    width: `100%`,
    marginLeft: drawerWidth,
    zIndex: "2020"
  },
  layout: {
    maxWidth: "100vw",
    maxHeight: "100vh",
    overflow: "hidden"
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
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" noWrap>
            Omnitron
          </Typography>
        </Toolbar>
      </AppBar>
      <CustomDrawer searchContact={searchContact} onSearchContact={onSearchContact}>
        <ContactsList
          searchContact={searchContact}
          contactId={currentContactId}
          onContactSelect={onContactSelect}
        />
      </CustomDrawer>
      <Grid item xs className={classes.layout}>
        <ChatLayout contactId={currentContactId} />
      </Grid>
    </div>
  );
}
