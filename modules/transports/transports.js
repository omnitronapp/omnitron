import { ChatsCollection } from "../chats/collections";
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
        transport.configureHandlers(transportEntry);

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

  getTransport(name) {
    return this.transports[name];
  }

  sendMessage(channel, chatId, message) {
    const userChat = ChatsCollection.findOne({
      _id: chatId
    });

    const transport = this.getTransport(channel);

    if (transport && userChat) {
      transport.sendMessage(userChat.channelChatId, message);
    } else {
      console.error("chat not found");
    }
  }

  stop(name) {
    const transportImpl = this.getTransport(name);
    transportImpl.stop();
  }
}
