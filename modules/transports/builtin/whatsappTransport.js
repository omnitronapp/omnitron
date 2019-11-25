import { EventEmitter } from "events";

import { Rest } from "../../rest/server";
import Twilio from "twilio";

export class Transport extends EventEmitter {
  constructor() {
    super();

    this.name = "whatsapp";
    this.channel = "whatsapp";
    this.title = "Whatsapp (Twilio)";
  }

  requireCredentials() {
    return [
      {
        key: "from",
        title: "From number"
      },
      {
        key: "accountSid",
        title: "Account SID"
      },
      {
        key: "authToken",
        title: "Auth Token"
      }
    ];
  }

  configure({ credentials }) {
    if (!credentials.accountSid || !credentials.authToken) {
      throw new Error(`${this.name} transport credentails not provided`);
    }

    this.client = new Twilio(credentials.accountSid, credentials.authToken);
    this.credentials = credentials;

    Rest.post("/whatsapp/status", (req, res) => {
      console.log(req.body);
      res.send({});
    });

    Rest.post(
      "/whatsapp/webhook",
      Meteor.bindEnvironment((req, res) => {
        const message = req.body;

        const date = Date.now();

        const username = message.From.replace("whatsapp:", "");
        const messageData = {
          messageId: message.SmsMessageSid,
          userId: message.AccountSid,
          username: username,
          firstName: username,
          chatId: message.From,
          date: date,
          text: message.Body,
          channel: "whatsapp"
        };

        this.emit("message", messageData);
      })
    );
  }

  sendMessage(chatId, message) {
    return new Promise((resolve, reject) => {
      if (this.client) {
        this.client.messages
          .create({
            body: message,
            from: this.credentials.from,
            to: chatId
          })
          .then(message => console.log(message.sid))
          .done(resolve);
      }
    });
  }

  stop() {
    this.client = null;
  }
}
