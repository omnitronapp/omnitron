import { Meteor } from "meteor/meteor";

import "../modules/imports";
import { transports } from "../modules/transports";

import "./fixtures";

Meteor.startup(() => {
  transports.configureTransports();
});
