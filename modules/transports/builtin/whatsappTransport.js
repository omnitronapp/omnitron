import { EventEmitter } from "events";

import { Rest } from "../../rest/server";
import Twilio from "twilio";
export class Transport extends EventEmitter {
  constructor() {
    super();

    this.name = "whatsapp";
    this.channel = "whatsapp";
    this.title = "Whatsapp (Twilio)";
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

    this.client = new Twilio(credentials.accountSid, credentials.authToken);
    this.credentials = credentials;
  }

  configureHandlers() {
    if (this.handlersCreated) {
      return;
    }
    this.handlersCreated = true;

    Rest.post("/whatsapp/status", (req, res) => {
      // TODO: Handle status message
      res.send({});
    });

    Rest.post(
      "/whatsapp/webhook",
      Meteor.bindEnvironment((req, res) => {
        const message = req.body;

        const response = new Twilio.twiml.MessagingResponse();

        const date = Date.now();

        const username = message.From.replace("whatsapp:", "");
        const messageData = {
          messageId: message.SmsMessageSid,
          userId: message.AccountSid,
          username: username,
          firstName: username,
          channelChatId: message.From,
          chatName: username,
          date: date,
          text: message.Body,
          type: "plain",
          channel: "whatsapp"
        };

        if (message.NumMedia) {
          // process all media objects
          for (let i = 0; i < message.NumMedia; i++) {
            const mediaType = message[`MediaContentType${i}`];
            if (mediaType === "image/jpeg") {
              messageData.type = "photo";
              messageData.photo = message[`MediaUrl${i}`];
              messageData.previewPhoto = message[`MediaUrl${i}`];
            }
          }
        }

        this.emit("message", {
          parsedMessage: messageData,
          rawMessage: message
        });

        res.type("text/xml");
        res.send(response.toString());
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
