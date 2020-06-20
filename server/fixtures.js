import { Meteor } from "meteor/meteor";
import _ from "underscore";
import { Accounts } from "meteor/accounts-base";

if (Meteor.users.find().count() === 0) {
  const admin = Accounts.createUser({ username: "omnitron", password: "omnitron" });
  Roles.addUsersToRoles(admin, ["admin"]);
}
