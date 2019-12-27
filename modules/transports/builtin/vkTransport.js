import { EventEmitter } from "events";

import { Rest } from "../../rest/server/";

export class Transport extends EventEmitter {
  constructor() {
    super();

    this.name = "vk";
    this.channel = "vk";
    this.title = "VK";
    this.linkToInstructions = "https://vk.link";

    this.webhookDefined = false;
  }

  requireCredentials() {
    return [
      {
        key: "group_id",
        title: "Group Id"
      },
      {
        key: "verify_token",
        title: "Verify Token"
      },
      {
        key: "secret_key",
        title: "Secret Key"
      }
    ];
  }

  webhookEndpoints() {
    return [
      {
        key: "webhook_url",
        title: "Webhook URL",
        url: `/webhook/vk`,
        method: "POST"
      }
    ];
  }

  configure({ credentials }) {
    if (!credentials || Object.keys(credentials) === 0) {
      throw new Error(`${this.name} transport credentials are not provided`);
    }

    this.credentials = credentials;
  }

  configureHandlers() {
    if (this.handlersCreated) {
      return;
    }
    this.handlersCreated = true;

    const mainWebhook = this.webhookEndpoints().find(
      webhook => webhook.key === "webhook_url"
    );

    Rest.post(
      mainWebhook.url,
      Meteor.bindEnvironment((req, res) => {
        const message = req.body;

        console.log(message, this.credentials);

        if (
          message.type === "confirmation" &&
          message.group_id + "" === this.credentials.group_id
        ) {
          res.send(this.credentials.verify_token);
          return;
        } else if (message.type === "message_new") {
          const messageData = {
            messageId: message.object.id,
            userId: message.object.user_id,
            username: message.object.user_id + "",
            firstName: message.object.user_id + "",
            chatName: message.object.user_id + "",
            channelChatId: message.object.user_id,
            date: new Date(),
            text: message.object.body,
            channel: "vk"
          };

          if (message.object.attachments) {
            const attachment = message.object.attachments[0];
            if (attachment.type === "photo") {
              messageData.type = "image";
              messageData.image = {
                previewImage: attachment.photo.photo_75,
                image: attachment.photo.photo_604
              };
            } else if (attachment.type === "doc") {
              if (attachment.doc.ext === "ogg") {
                messageData.type = "voice";
                messageData.voice = {
                  link: attachment.doc.url,
                  duration: 0,
                  size: attachment.doc.size,
                  type: "audio/ogg"
                };
              } else {
                messageData.type = "document";
                messageData.document = {
                  title: attachment.doc.title,
                  link: attachment.doc.url,
                  size: attachment.doc.size
                };
              }
            } else if (attachment.type === "audio") {
              messageData.type = "voice";
              messageData.voice = {
                link: attachment.audio.url,
                duration: attachment.audio.duration,
                size: 0,
                type: "mp3"
              };

              if (messageData.text === "") {
                messageData.text = attachment.audio.title;
              }
            } else if (attachment.type === "video") {
              messageData.type = "video";
              messageData.video = {
                size: 0,
                type: "mp4",
                duration: attachment.video.duration,
                link: attachment.video.photo_1280
              };
            }
          }

          this.emit("message", {
            parsedMessage: messageData,
            rawMessage: message
          });
        }
        res.send("ok");
      })
    );
  }

  sendMessage(chatId, message) {
    return new Promise((resolve, reject) => {});
  }

  stop() {
    this.credentials = null;
  }
}
