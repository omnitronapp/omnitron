import { Meteor } from "meteor/meteor";
import { ContactsCollection } from "../collections";

Meteor.publish("contacts", function() {
  if (!this.userId) {
    return this.ready();
  }

  return ContactsCollection.find({});
});
