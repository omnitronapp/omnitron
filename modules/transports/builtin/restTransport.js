import { Meteor } from "meteor/meteor";
import { EventEmitter } from "events";
import request from "request";

import { Rest } from "../../rest/server/";
import { TransportsCollection } from "../collections";

export class Transport extends EventEmitter {
  constructor() {
    super();

    this.name = "rest";
    this.channel = "rest";
    this.title = "REST API";
    this.linkToInstructions = "https://core.telegram.org/bots";

    this.webhookDefined = false;
  }

  requireCredentials() {
    return [
      {
        key: "secretKey",
        title: "Secret Key",
        type: "password"
      },
      {
        key: "serviceUrl",
        title: "Service API endpoint"
      }
    ];
  }

  webhookEndpoints() {
    return [
      {
        key: "webhook_url",
        title: "Webhook URL",
        url: `/webhook/rest`,
        method: "POST"
      }
    ];
  }

  configure({ credentials }) {
    if (!credentials || Object.keys(credentials) === 0) {
      throw new Error(`${this.name} transport credentails not provided`);
    }

    this.credentials = credentials;
  }

  async configureHandlers() {
    if (this.webhookDefined) {
      return;
    }

    const mainWebhook = this.webhookEndpoints().find(webhook => webhook.key === "webhook_url");

    this.webhookDefined = true;

    Rest.post(
      mainWebhook.url,
      Meteor.bindEnvironment((req, res) => {
        const transportDoc = TransportsCollection.findOne(
          { channel: "rest" },
          { fields: { credentials: 1 } }
        );

        if (req.header("secret-key") !== transportDoc.credentials.secretKey) {
          res.status(401);
          res.send();
          return;
        }

        const { message: rawMessage } = req.body;

        const messageData = {
          messageId: rawMessage.messageId,
          userId: rawMessage.userId || rawMessage.username,
          username: rawMessage.username,
          firstName: rawMessage.name || rawMessage.username,
          chatName: rawMessage.name || rawMessage.username,
          channelChatId: rawMessage.chatId || rawMessage.userId || rawMessage.username,
          text: rawMessage.text,
          channel: "rest",
          type: rawMessage.type || "plain",
          date: new Date()
        };

        if (rawMessage.type === "image") {
          messageData.image = {
            previewImage: rawMessage.mediaUrl,
            image: rawMessage.mediaUrl
          };
        } else if (rawMessage.type === "voice") {
          messageData.voice = {
            link: rawMessage.mediaUrl,
            duration: 1,
            size: 0,
            type: "audio/basic"
          };
        } else if (rawMessage.type === "video") {
          messageData.video = {
            link: rawMessage.mediaUrl,
            duration: 0,
            type: "video/mpeg",
            size: 0
          };
        } else if (rawMessage.document === "document") {
          messageData.document = {
            link: rawMessage.mediaUrl,
            title: rawMessage.mediaUrl,
            size: 1024 * 1024
          };
        }

        this.emit("message", {
          parsedMessage: messageData,
          rawMessage
        });

        res.send({});
      })
    );
  }

  sendMessage(chatId, message) {
    return new Promise((resolve, reject) => {
      const serviceUrl = this.credentials.serviceUrl;

      request.post(serviceUrl, { body: { chatId, message } }, () => {
        resolve();
      });
    });
  }

  stop() {
    this.credentials = null;
  }
}
