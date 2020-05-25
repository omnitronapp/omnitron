import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";

import { TransportsCollection } from "../collections";

Meteor.publish("transports", function() {
  if (!Roles.userIsInRole(this.userId, "READ_TRANSPORTS")) {
    this.ready();
    return;
  }

  return TransportsCollection.find();
});
