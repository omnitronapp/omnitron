import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import { MessagesCollection } from "../collections";

Meteor.methods({
  createMessage({ contactId, message }) {
    check(contactId, String);
    check(message, String);

    MessagesCollection.insert({
      contactId,
      message,
      createdDate: new Date()
    });
  }
});
