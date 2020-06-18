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
    "CHANGE_USERS"
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
    if (!Meteor.roles.findOne(role.roleName)) {
      Roles.createRole(role.roleName);
      role.children.forEach(child => {
        Roles.addRolesToParent(child, role.roleName);
      });
    }
  });
}
