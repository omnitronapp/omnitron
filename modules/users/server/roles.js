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
    try {
      Roles.createRole(roleName);
    } catch {}
  });

  const roles = [
    { roleName: "admin", children: childRoles },
    { roleName: "agent", children: ["SEND_MESSAGES", "READ_MESSAGES"] }
  ];

  roles.forEach(role => {
    try {
      Roles.createRole(role["roleName"]);
    } catch {}
    role["children"].forEach(child => {
      try {
        Roles.addRolesToParent(child, role["roleName"]);
      } catch {}
    });
  });
}
