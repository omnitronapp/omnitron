import { Meteor } from "meteor/meteor";
import { check, Match } from "meteor/check";
import { ContactsCollection } from "../collections";

Meteor.publish("contacts", function(name, options) {
  check(name, Match.Maybe(String));
  check(options, Object);

  if (!this.userId) {
    return this.ready();
  }

  let filters = {};

  if (name) {
    filters = {
      name: { $regex: name, $options: "i" }
    };
  }

  return ContactsCollection.find(filters, options);
});
