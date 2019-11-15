import { Meteor } from "meteor/meteor";

import "./methods";

if (Meteor.isServer) {
  import "./server/";
}
