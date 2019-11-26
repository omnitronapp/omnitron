import { Meteor } from "meteor/meteor";
import { check, Match } from "meteor/check";
import { ContactsCollection } from "../collections";

Meteor.publish("contacts", function(name) {
  check(name, Match.Maybe(String));

  if (!this.userId) {
    return this.ready();
  }

  let filters = {};

  if (name) {
    filters = {
      name: { $regex: name, $options: "i" }
    };
  }

  return ContactsCollection.find(filters);
});
