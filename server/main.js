import { Meteor } from "meteor/meteor";

import "../modules/imports";
import { Transports, registerBasicTransports } from "../modules/transports";

import "./fixtures";

Meteor.startup(() => {
  registerBasicTransports();
  Transports.configureTransports();
});
