import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";

import { TransportsCollection } from "../collections";

Meteor.publish("transports", function() {
  check(this.userId, String);

  return TransportsCollection.find();
});
