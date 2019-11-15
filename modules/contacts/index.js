import { Meteor } from "meteor/meteor";

import "./collections";

if (Meteor.isServer) {
  import "./server";
}
