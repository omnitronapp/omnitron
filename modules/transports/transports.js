import { UserChannels } from "../channels/collection";

export class Transports {
  constructor() {
    this.transports = {};
  }

  registerTransport(channel, transportInstance) {
    this.transports[channel] = transportInstance;
  }

  configureTransports() {
    Object.values(this.transports).forEach(transport => {
      transport.configure(/** CREDENTIALS object */);

      transport.on(
        "message",
        Meteor.bindEnvironment(messageData => {
          Meteor.call("receiveMessage", messageData);
        })
      );
    });
  }

  getTransport(channel) {
    return this.transports[channel];
  }

  sendMessage(channel, contactId, message) {
    const userChannel = UserChannels.findOne({
      contactId,
      channel: channel
    });

    const transport = this.getTransport(channel);

    if (transport && userChannel) {
      transport.sendMessage(userChannel.chatId, message);
    }
  }
}
