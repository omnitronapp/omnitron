import { resetDatabase } from "meteor/xolvio:cleaner";
import sinon from "sinon";
import { returned } from "sinon";
import { registerBasicTransports, Transports } from ".";
import { expect } from "chai";

import { Transport as TelegramTransport } from "./builtin/telegramTransport";
import { Transport as WhatsappTransport } from "./builtin/whatsappTransport";
import { Transport as VKTransport } from "./builtin/vkTransport";
import { Transport as MessengerTwilio } from "./builtin/messengerTwilioTransport";
import { Transport as RestTransport } from "./builtin/restTransport";

describe("registerBasicTransports() method test", () => {
  beforeEach(() => {
    resetDatabase();
    sinon.replace(Transports, "registerTransport", sinon.fake());
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should register transports", () => {
    const builtInTransports = [
      new TelegramTransport(),
      new WhatsappTransport(),
      new MessengerTwilio(),
      new VKTransport(),
      new RestTransport()
    ];

    registerBasicTransports();

    builtInTransports.forEach(transport => {
      expect(Transports.registerTransport.calledWith(transport));
    });
  });
});
