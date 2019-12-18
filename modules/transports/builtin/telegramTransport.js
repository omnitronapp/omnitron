import { EventEmitter } from "events";
import url from "url";

const Telegraf = require("telegraf");

import { Rest } from "../../rest/server/";

export class Transport extends EventEmitter {
  constructor() {
    super();

    this.name = "telegram";
    this.channel = "telegram";
    this.title = "Telegram";
  }

  requireCredentials() {
    return [
      {
        key: "token",
        title: "Bot Token",
        type: "password"
      }
    ];
  }

  configure({ credentials }) {
    if (!credentials || Object.keys(credentials) === 0) {
      throw new Error(`${this.name} transport credentails not provided`);
    }

    if (this.bot) {
      this.bot.stop();
      this.bot = null;
    }

    this.bot = new Telegraf(credentials.token);

    this.credentials = credentials;
  }

  configureHandlers() {
    this.bot.telegram.deleteWebhook().then(() => {
      this.bot.telegram.setWebhook(url.resolve(process.env.ROOT_URL, "/webhook/telegram"));
      Rest.use(this.bot.webhookCallback("/webhook/telegram"));

      // Rest.post(`/webhook/telegram`, (req, res) => {
      //   console.log(req.body);
      //   this.bot.handleUpdate(req.body, res);
      // });

      this.bot.on(["photo", "document"], ctx => {
        try {
          const { message } = ctx;

          const retrieveFilesPromises = [];

          const isPhoto = message.photo || false;
          const isDocument = message.document || false;

          if (isPhoto) {
            const previewPhotoId = message.photo[0].file_id;
            const photoId = message.photo[message.photo.length - 1].file_id;

            retrieveFilesPromises.push(
              this.bot.telegram.getFileLink(previewPhotoId),
              this.bot.telegram.getFileLink(photoId)
            );
          } else if (isDocument) {
            const documentId = message.document.file_id;
            retrieveFilesPromises.push(this.bot.telegram.getFileLink(documentId));
          }

          Promise.all(retrieveFilesPromises)
            .then(links => {
              const date = new Date();
              let messageData = {
                messageId: message.message_id,
                userId: message.from.id,
                username: message.from.username,
                firstName: message.from.first_name,
                chatName:
                  message.chat.type === "private" ? message.chat.username : message.chat.title,
                channelChatId: message.chat.id,
                date: date,
                text: message.text,
                channel: "telegram"
              };

              if (isPhoto) {
                messageData = {
                  ...messageData,
                  type: "photo",
                  previewPhoto: links[0],
                  photo: links[1]
                };
              } else if (isDocument) {
                messageData = {
                  ...messageData,
                  type: "document",
                  document: {
                    link: links[0],
                    title: message.document.file_name,
                    size: message.document.file_size
                  }
                };
              }

              this.emit("message", {
                parsedMessage: messageData,
                rawMessage: message
              });
            })
            .catch(err => {
              console.error("Could not retrieve photo links from telegram", err.message);
            });
        } catch (e) {
          console.error(e);
        }
      });

      this.bot.on("text", ctx => {
        const { message } = ctx;

        const date = Date.now();

        const messageData = {
          messageId: message.message_id,
          userId: message.from.id,
          username: message.from.username,
          firstName: message.from.first_name,
          chatName: message.chat.type === "private" ? message.chat.username : message.chat.title,
          channelChatId: message.chat.id,
          date: date,
          text: message.text,
          type: "plain",
          channel: "telegram"
        };

        this.emit("message", {
          parsedMessage: messageData,
          rawMessage: message
        });
      });
    });
  }

  sendMessage(chatId, message) {
    return new Promise((resolve, reject) => {
      if (this.bot) {
        return this.bot.telegram.sendMessage(chatId, message).then(() => resolve(), () => reject());
      } else {
        reject("Bot is disabled");
      }
    });
  }

  stop() {
    this.credentials = null;
    if (this.bot) {
      this.bot.stop(() => {
        console.error("telegram bot stopped");
      });
    }
  }
}
