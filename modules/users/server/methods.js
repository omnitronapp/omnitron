import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import { Accounts } from "meteor/accounts-base";

import { distributorInterface } from "../../distribution/server";

Meteor.methods({
  updateUserCredentials(credentials) {
    check(this.userId, String);
    check(credentials, Object);

    const user = Meteor.user();

    if (user.username !== credentials.username) {
      Accounts.setUsername(Meteor.userId(), credentials.username, { logout: true });
    }

    Accounts.setPassword(Meteor.userId(), credentials.password, { logout: true });
  },
  removeUser(userIdToRemove) {
    check(this.userId, String);
    check(userIdToRemove, String);

    Meteor.users.update(
      { _id: userIdToRemove },
      {
        $set: {
          active: false
        }
      }
    );

    // Reconfigure  Distribution Algorithms
    distributorInterface.userDataChanged();
  },
  editUser(userIdToEdit, userProps) {
    check(this.userId, String);
    check(userIdToEdit, String);
    check(userProps, Object);

    const user = Meteor.users.findOne({ _id: userIdToEdit });

    if (user.username !== userProps.username) {
      Accounts.setUsername(userIdToEdit, userProps.username);
    }
    if (userProps.password && userProps.password !== "") {
      Accounts.setPassword(userIdToEdit, userProps.password);
    }
  },
  addUser(userProps) {
    check(this.userId, String);
    check(userProps, Object);

    const userId = Accounts.createUser({
      username: userProps.username,
      password: userProps.password
    });

    // Reconfigure  Distribution Algorithms
    distributorInterface.userDataChanged();

    return userId;
  }
});
