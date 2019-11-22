import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";

import { TransportsCollection } from "../collections";

Meteor.methods({
  updateTransport(_id, properties) {
    check(_id, String);
    check(properties, Object);

    TransportsCollection.update(_id, {
      $set: {
        ...properties
      }
    });
  }
});
