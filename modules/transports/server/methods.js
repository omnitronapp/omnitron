import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import { Transports } from "../";
import { TransportsCollection } from "../collections";

Meteor.methods({
  changeTransportStatus(_id, enabled) {
    check(_id, String);
    check(enabled, Boolean);

    TransportsCollection.update(_id, {
      $set: {
        enabled
      }
    });
  },
  updateTransportCredential(_id, key, value) {
    check(_id, String);
    check(key, String);
    check(value, String);

    TransportsCollection.update(_id, {
      $set: {
        [`credentials.${key}`]: value
      }
    });
  }
});
