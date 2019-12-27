import { Meteor } from "meteor/meteor";

import "../modules/imports";
import { Transports, registerBasicTransports } from "../modules/transports";
import { startTransportsWatcher } from "../modules/transports/server/transportsWatcher";

import "./fixtures";
import "./indexes";

Meteor.startup(() => {
  registerBasicTransports();
  Transports.configureTransports();

  startTransportsWatcher();
});
