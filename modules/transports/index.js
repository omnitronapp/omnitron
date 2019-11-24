import { Meteor } from "meteor/meteor";

import { Transports as TransportsClass } from "./transports";

import { Transport as TelegramTransport } from "./builtin/telegramTransport";

export const Transports = new TransportsClass();

export function registerBasicTransports() {
  const builtInTransports = [new TelegramTransport()];

  builtInTransports.forEach(transport => {
    Transports.registerTransport(transport);
  });
}

if (Meteor.isServer) {
  import "./server";
}
