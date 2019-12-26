import { Meteor } from "meteor/meteor";

import "../modules/imports";
import { Transports, registerBasicTransports } from "../modules/transports";

import "./fixtures";
import "./indexes";

Meteor.startup(() => {
  registerBasicTransports();
  Transports.configureTransports();
});
