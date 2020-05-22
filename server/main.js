import { Meteor } from "meteor/meteor";
import "../modules/imports";
import { registerBasicTransports, Transports } from "../modules/transports";
import { startTransportsWatcher } from "../modules/transports/server/transportsWatcher";
import { initializeRoles } from "../modules/users/server/roles";
import "./fixtures";
import "./indexes";

Meteor.startup(() => {
  registerBasicTransports();
  Transports.configureTransports();
  initializeRoles();
  startTransportsWatcher();
});
