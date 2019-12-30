import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import { Transports } from "../";
import { TransportsCollection } from "../collections";

Meteor.methods({
  changeTransportStatus(_id, enabled) {
    check(_id, String);
    check(enabled, Boolean);

    const transportEntry = TransportsCollection.findOne(_id);
    const checkResult = Transports.checkCredentials(transportEntry);

    if (checkResult === true) {
      TransportsCollection.update(_id, {
        $set: {
          enabled
        }
      });
    } else {
      TransportsCollection.update(_id, {
        $set: {
          enabled: false,
          errorMessage: checkResult
        }
      });
    }
  },
  updateTransportCredential(_id, key, value) {
    check(_id, String);
    check(key, String);
    check(value, String);

    const transportEntry = TransportsCollection.findOne(_id);
    transportEntry.credentials[key] = value;
    const checkResult = Transports.checkCredentials(transportEntry);

    const correctCreds = checkResult === true;

    TransportsCollection.update(_id, {
      $set: {
        [`credentials.${key}`]: value,
        enabled: transportEntry.enabled && correctCreds,
        errorMessage: correctCreds ? null : checkResult
      }
    });
  }
});
