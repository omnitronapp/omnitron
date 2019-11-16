import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";

import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import { ContactItem } from "./contactItem";

import { ContactsCollection } from "../../collections";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
    height: "100%",
    overflowY: "scroll"
  },
  inline: {
    display: "inline"
  }
}));

function ContactsList({ contacts, contactId, ready, onContactSelect }) {
  const classes = useStyles();

  const contactsRender = contacts.map(contact => {
    return (
      <ContactItem
        key={contact._id}
        {...contact}
        selected={contact._id === contactId}
        onContactSelect={onContactSelect}
      />
    );
  });

  return <List className={classes.root}>{contactsRender}</List>;
}

export default withTracker(() => {
  const subHandler = Meteor.subscribe("contacts");
  const contacts = ContactsCollection.find().fetch();

  return {
    contacts,
    ready: subHandler.ready()
  };
})(ContactsList);
