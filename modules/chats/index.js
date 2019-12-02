import { Meteor } from "meteor/meteor";

import { ChatsCollection } from "./collections";

if (Meteor.isServer) {
  import "./server";
}

export { ChatsCollection };
