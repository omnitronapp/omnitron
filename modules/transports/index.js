import { Meteor } from "meteor/meteor";

import { Transports } from "./transports";

export const transports = new Transports();

if (Meteor.isServer) {
  import "./server";
}
