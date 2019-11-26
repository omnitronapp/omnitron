import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";

import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import { ContactItem } from "./contactItem";
import InfiniteScroll from "react-infinite-scroller";

import { ContactsCollection } from "../../collections";

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

function ShowContacts({ contacts, contactId, ready, onContactSelect, incrementPage, page }) {
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

  const loadMore = function() {
    incrementPage(page);
  };

  return (
    <List className={classes.root}>
      <InfiniteScroll pageStart={page} loadMore={loadMore} hasMore={false}>
        {contactsRender}
      </InfiniteScroll>
    </List>
  );
}

export default withTracker(({ searchContact, page }) => {
  const options = {
    limit: page * 10
  };
  const subHandler = Meteor.subscribe("contacts", searchContact, options);
  const contacts = ContactsCollection.find().fetch();

  return {
    contacts,
    ready: subHandler.ready()
  };
})(ShowContacts);
