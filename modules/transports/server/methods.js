import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import { Transports } from "../";
import { TransportsCollection } from "../collections";

Meteor.methods({
  updateTransport({ transportId, credentials, enabled }) {
    check(transportId, String);
    check(credentials, Object);
    check(enabled, Boolean);

    if (!Roles.userIsInRole(this.userId, "CHANGE_TRANSPORTS"))
      throw new Error("User doesn't have permission CHANGE_TRANSPORTS");

    const updateFields = {
      credentials,
      enabled
    };

    const transportEntry = TransportsCollection.findOne(transportId);
    transportEntry.credentials = credentials;

    const checkResult = Transports.checkCredentials(transportEntry);

    // did not pass check
    if (checkResult !== true) {
      updateFields.enabled = false;
      updateFields.errorMessage = checkResult;
    } else {
      updateFields.errorMessage = null;
    }

    TransportsCollection.update(transportId, {
      $set: updateFields
    });
  }
});
