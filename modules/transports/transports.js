import { ChatsCollection } from "../chats/collections";
import { TransportsCollection } from "./collections";
import { LogsCollection } from "../logs/collections";

function writeLog(transport, type, text) {
  LogsCollection.insert({
    event: "transport",
    transport,
    type,
    text,
    createdAt: new Date()
  });
}

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

    // writeLog(
    //   transportInstance.name,
    //   "debug",
    //   `Transport ${transportInstance.name} was successfully registered`
    // );
  }

  checkCredentials(transportEntry) {
    const { requiredCredentials = [], credentials = {} } = transportEntry;

    let result = true;
    requiredCredentials.forEach(({ key, title }) => {
      if (credentials[key] === undefined || credentials[key] === null || credentials[key] === "") {
        result = `Required ${title} not provided`;
      }
    });

    if (result === true) {
      writeLog(transportEntry.name, "debug", `Transport credentials are correct`);
    } else {
      writeLog(transportEntry.name, "error", `Please check transport credentials again!`);
    }

    return result;
  }

  async configureTransport(name) {
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

          try {
            await transport.configure(transportEntry);
            await transport.configureHandlers(transportEntry);

            writeLog(name, "debug", `Transport ${name} was configured`);
          } catch (e) {
            this.stop(name);
            writeLog(name, "error", `Failed to configure ${name} transport: ${e.message}`);

            TransportsCollection.update(
              {
                _id: transportEntry._id
              },
              {
                $set: {
                  enabled: false,
                  errorMessage: e.message
                }
              }
            );

            console.error(e);
          }
        } else {
          TransportsCollection.update(
            {
              _id: transportEntry._id
            },
            {
              $set: {
                enabled: false,
                errorMessage: checkResult
              }
            }
          );
        }
      } else {
        console.log(`Transport ${name} is disabled`);
      }
    } else {
      writeLog(name, "error", `Transport ${name} is not created in database`);
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
      writeLog(
        transport.name,
        "error",
        `Transport: ${transport.name}, chat ${chatId} in ${channel} not found!`
      );
      console.error("chat not found");
    }
  }

  stop(name) {
    const transportImpl = this.getTransport(name);
    transportImpl.stop();

    writeLog(name, "warn", `Transport ${name} was stopped`);
  }
}
