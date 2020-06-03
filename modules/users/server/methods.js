import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import { Accounts } from "meteor/accounts-base";

import { distributorInterface } from "../../distribution/server";

Meteor.methods({
  updateUserCredentials(credentials) {
    check(this.userId, String);
    check(credentials, Object);

    if (!Roles.userIsInRole(this.userId, "CHANGE_USERS"))
      throw new Error("User doesn't have permission CHANGE_USERS");

    const user = Meteor.user();

    if (user.username !== credentials.username) {
      Accounts.setUsername(Meteor.userId(), credentials.username, { logout: true });
    }

    Accounts.setPassword(Meteor.userId(), credentials.password, { logout: true });
  },
  removeUser(userIdToRemove) {
    check(userIdToRemove, String);
    check(this.userId, String);

    if (!Roles.userIsInRole(this.userId, "REMOVE_USERS"))
      throw new Error("User doesn't have permission REMOVE_USERS");

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

    if (!Roles.userIsInRole(this.userId, "CHANGE_USERS"))
      throw new Error("User doesn't have permission CHANGE_USERS");

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

    if (!Roles.userIsInRole(this.userId, "ADD_USERS"))
      throw new Error("User doesn't have permission ADD_USERS");

    const userId = Accounts.createUser({
      username: userProps.username,
      password: userProps.password
    });

    // Reconfigure  Distribution Algorithms
    distributorInterface.userDataChanged();

    return userId;
  },
  setRole(userId, roleId) {
    check(userId, String);
    check(roleId, String);

    Roles.addUsersToRoles(userId, roleId);
  },

  createNewRole(roleName, roles) {
    check(roleName, String);
    check(roles, [String]);

    try {
      Roles.createRole(roleName);
    } catch (e) {
      throw e;
    }

    roles.forEach(role => {
      try {
        Roles.addRolesToParent(role, roleName);
      } catch (e) {
        throw e;
      }
    });
  }
});
