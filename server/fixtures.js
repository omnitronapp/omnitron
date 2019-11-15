import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";

if (Meteor.users.find().count() === 0) {
  Accounts.createUser({ username: "omnisend", password: "omnisend" });
}
