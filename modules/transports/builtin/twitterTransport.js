import { EventEmitter } from "events";

import { Rest } from "../../rest/server";

export class Transport extends EventEmitter {
  constructor() {
    super();

    this.name = "twitter";
    this.channel = "twitter";
    this.title = "Twitter (DMs only)";
    this.handlersCreated = false;
  }

  requireCredentials() {
    return [
      {
        key: "from",
        title: "From number"
      },
      {
        key: "accountSid",
        title: "Account SID",
        type: "password"
      },
      {
        key: "authToken",
        title: "Auth Token",
        type: "password"
      }
    ];
  }

  configure({ credentials }) {
    if (!credentials.accountSid || !credentials.authToken) {
      throw new Error(`${this.name} transport credentails not provided`);
    }

    this.credentials = credentials;

    // SEND Request to Twitter to register an endpoint
  }

  configureHandlers() {
    if (this.handlersCreated) {
      return;
    }
    this.handlersCreated = true;

    Rest.get("/webhook/twitter", (req, res) => {
      // TODO: complete CRC challenge
      res.send({
        type: "Twitter CRC challenge"
      });
    });

    Rest.post(
      "/webhook/twitter",
      Meteor.bindEnvironment((req, res) => {
        // TODO: Complete receiving message
      })
    );
  }

  sendMessage(chatId, message) {
    return new Promise((resolve, reject) => {
      // TODO: Complete sending message
    });
  }

  stop() {
    this.client = null;
  }
}
