export const permissions = [
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

export const roles = [
  { roleName: "admin", children: permissions },
  { roleName: "agent", children: ["SEND_MESSAGES", "READ_MESSAGES"] }
];
