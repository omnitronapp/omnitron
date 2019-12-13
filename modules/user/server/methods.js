import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import { Accounts } from "meteor/accounts-base";

Meteor.methods({
  updateUserCredentials(credentials) {
    check(this.userId, String);
    check(credentials, Object);

    const user = Meteor.user();

    if (user.username !== credentials.username) {
      Accounts.setUsername(Meteor.userId(), credentials.username, { logout: true });
    }

    Accounts.setPassword(Meteor.userId(), credentials.password, { logout: true });
  }
});
