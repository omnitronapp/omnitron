import { UserChannels } from "../channels/collection";
import { TransportsCollection } from "./collections";

export class Transports {
  constructor() {
    this.transports = {};
  }

  registerTransport(transportInstance) {
    this.transports[transportInstance.name] = transportInstance;

    const transportEntry = TransportsCollection.findOne({ name: transportInstance.name });

    if (transportEntry) {
      // if required credentials was changed
      TransportsCollection.update(
        { _id: transportEntry._id },
        {
          $set: {
            requiredCredentials: transportInstance.requireCredentials()
          }
        }
      );
    } else {
      const newTransportEntry = {
        name: transportInstance.name,
        channel: transportInstance.channel,
        enabled: false,
        requiredCredentials: transportInstance.requireCredentials(),
        credentials: {}
      };

      TransportsCollection.insert(newTransportEntry);
    }
  }

  areCredentialsSatisfied() {}

  configureTransport(name) {
    const transport = this.getTransport(name);

    const transportEntry = TransportsCollection.findOne({ name });

    if (transportEntry) {
      if (transportEntry.enabled) {
        transport.configure(transportEntry);

        transport.on(
          "message",
          Meteor.bindEnvironment(message => {
            Meteor.call("receiveMessage", message);
          })
        );
      } else {
        console.log(`Transport ${name} is disabled`);
      }
    } else {
      throw new Error("Transport entry is not created in database");
    }
  }

  configureTransports() {
    Object.keys(this.transports).forEach(transportName => {
      this.configureTransport(transportName);
    });
  }

  getTransports() {
    return this.transports;
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
