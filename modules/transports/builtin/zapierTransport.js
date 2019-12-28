import { EventEmitter } from "events";
import { Rest } from "../../rest/server";

export class Transport extends EventEmitter {
  constructor() {
    super();

    this.name = "zapier";
    this.channel = "zapier";
    this.title = "Zapier";
    this.linkToInstructions = "https://zapier.com";

    this.handlersCreated = false;
  }

  requireCredentials() {
    return [
      {
        key: "api_key",
        title: "API Key"
      }
    ];
  }

  webhookEndpoints() {
    return [
      {
        key: "auth_url",
        title: "Webhook URL",
        url: `/webhook/zapier/auth`,
        method: "POST"
      },
      {
        key: "webhook_url",
        title: "Webhook URL",
        url: `/webhook/zapier`,
        method: "POST"
      },
      {
        key: "subscription_url",
        title: "Subscription URL",
        url: "/webhook/zapier/subscribe",
        method: "POST"
      },
      {
        key: "unsubscription_url",
        title: "Unsubscription URL",
        url: "/webhook/zapier/subscribe",
        method: "DELETE"
      }
    ];
  }

  configure({ credentials }) {
    if (!credentials.api_key) {
      throw new Error(`${this.name} transport credentails not provided`);
    }

    this.credentials = credentials;
  }

  configureHandlers() {
    if (this.handlersCreated) {
      return;
    }
    this.handlersCreated = true;

    const mainWebhook = this.webhookEndpoints().find(webhook => webhook.key === "webhook_url");
    const authWebhook = this.webhookEndpoints().find(webhook => webhook.key === "auth_url");

    Rest.post(
      authWebhook.url,
      Meteor.bindEnvironment((req, res) => {
        if (req.headers["x-api-key"] === this.credentials.api_key) {
          res.send({});
        } else {
          res.status(500);
          res.send({});
        }
      })
    );

    Rest.post(
      mainWebhook.url,
      Meteor.bindEnvironment((req, res) => {
        const { body } = req;

        const messageData = {
          messageId: body.messageId,
          userId: body.userId,
          username: body.userId,
          firstName: body.userId,
          channelChatId: body.userId,
          chatName: body.chatName,
          date: new Date(),
          text: body.message,
          type: "plain",
          channel: "zapier"
        };

        this.emit("message", {
          parsedMessage: messageData,
          rawMessage: req.body
        });

        res.send({});
      })
    );
  }

  sendMessage(chatId, message) {
    return new Promise((resolve, reject) => {
      if (this.client) {
        console.log(chatId, message);
      }
    });
  }

  stop() {
    this.client = null;
  }
}
