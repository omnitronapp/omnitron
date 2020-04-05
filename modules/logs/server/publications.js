import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";

import { LogsCollection } from "../collections";

Meteor.publish("logs", function(filter) {
  check(this.userId, String);
  check(filter, Object);

  return LogsCollection.find(filter, { sort: { createdAt: -1 }, limit: 50 });
});
