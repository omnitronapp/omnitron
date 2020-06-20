import { Roles } from "meteor/alanning:roles";

export function initializeRoles(params) {
  const childRoles = [
    "READ_MESSAGES",
    "SEND_MESSAGES",
    "REMOVE_MESSAGES",
    "READ_SETTINGS",
    "CHANGE_SETTINGS",
    "READ_TRANSPORTS",
    "CHANGE_TRANSPORTS",
    "ADD_USERS",
    "LIST_USERS",
    "CHANGE_USERS",
    "REMOVE_USERS"
  ];
  childRoles.forEach(roleName => {
    if (!Meteor.roles.findOne(roleName)) {
      Roles.createRole(roleName);
    }
  });

  const roles = [
    { roleName: "admin", children: childRoles },
    { roleName: "agent", children: ["SEND_MESSAGES", "READ_MESSAGES"] }
  ];

  roles.forEach(role => {
<<<<<<< HEAD
    try {
      Roles.createRole(role.roleName);
    } catch {}
    role.children.forEach(child => {
      try {
        Roles.addRolesToParent(child, role.roleName);
      } catch {}
    });
  });

  const users = Meteor.users.find().fetch();
  const userIds = users.map(user => user._id);
  userIds.forEach(userId => {
    Roles.addUsersToRoles(userId, ["admin"]);
=======
    if (!Meteor.roles.findOne(role.roleName)) {
      Roles.createRole(role.roleName);
      role.children.forEach(child => {
        Roles.addRolesToParent(child, role.roleName);
      });
    }
>>>>>>> 62decd8919cb469faaa2d1d6ce9957a5e2614517
  });
}
