import { ChatsCollection } from "../chats/collections";
import { TransportsCollection } from "./collections";

export class Transports {
  constructor() {
    this.transports = {};
  }

  registerTransport(transportInstance) {
    this.transports[transportInstance.name] = transportInstance;

    transportInstance.on(
      "message",
      Meteor.bindEnvironment(message => {
        Meteor.call("receiveMessage", message);
      })
    );

    const transportEntry = TransportsCollection.findOne({
      name: transportInstance.name
    });

    if (transportEntry) {
      // if required credentials was changed
      TransportsCollection.update(
        { _id: transportEntry._id },
        {
          $set: {
            requiredCredentials: transportInstance.requireCredentials(),
            webhookEndpoints: transportInstance.webhookEndpoints(),
            linkToInstructions: transportInstance.linkToInstructions
          }
        }
      );
    } else {
      const newTransportEntry = {
        name: transportInstance.name,
        channel: transportInstance.channel,
        enabled: false,
        requiredCredentials: transportInstance.requireCredentials(),
        webhookEndpoints: transportInstance.webhookEndpoints(),
        linkToInstructions: transportInstance.linkToInstructions,
        credentials: {}
      };

      TransportsCollection.insert(newTransportEntry);
    }
  }

  checkCredentials(transportEntry) {
    const { requiredCredentials = [], credentials = {} } = transportEntry;

    let result = true;
    requiredCredentials.forEach(({ key, title }) => {
      if (credentials[key] === undefined || credentials[key] === null || credentials[key] === "") {
        result = `Required ${title} not provided`;
      }
    });

    return result;
  }

  configureTransport(name) {
    const transport = this.getTransport(name);

    const transportEntry = TransportsCollection.findOne({ name });

    if (transportEntry) {
      if (transportEntry.enabled) {
        const checkResult = this.checkCredentials(transportEntry);

        if (checkResult === true) {
          TransportsCollection.update(
            {
              _id: transportEntry._id
            },
            {
              $set: {
                errorMessage: null
              }
            }
          );

          transport.configure(transportEntry);
          transport.configureHandlers(transportEntry);
        } else {
          TransportsCollection.update(
            {
              _id: transportEntry._id
            },
            {
              $set: {
                errorMessage: checkResult
              }
            }
          );
        }
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
