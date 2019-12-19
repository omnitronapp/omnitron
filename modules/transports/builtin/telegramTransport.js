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

    this.webhookDefined = false;
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
                  type: "image",
                  image: {
                    previewImage: links[0],
                    image: links[1]
                  }
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

      this.bot.on("voice", ctx => {
        const { message } = ctx;
        const { voice } = message;

        const { duration, mime_type: type, file_size: size, file_id: voiceId } = voice;

        this.bot.telegram
          .getFileLink(voiceId)
          .then(link => {
            const date = Date.now();

            const messageData = {
              messageId: message.message_id,
              userId: message.from.id,
              username: message.from.username,
              firstName: message.from.first_name,
              chatName:
                message.chat.type === "private" ? message.chat.username : message.chat.title,
              channelChatId: message.chat.id,
              date: date,
              text: message.text,
              type: "voice",
              channel: "telegram",
              voice: {
                link,
                duration,
                type,
                size
              }
            };

            this.emit("message", {
              parsedMessage: messageData,
              rawMessage: message
            });
          })
          .catch(err => {
            console.error("couldn't retrieve voice message", err.message);
          });
      });

      this.configureWebhook();
    });
  }

  configureWebhook() {
    if (this.webhookDefined) {
      return;
    }
    this.webhookDefined = true;

    this.bot.telegram.setWebhook(url.resolve(process.env.ROOT_URL, "/webhook/telegram"));
    Rest.post(`/webhook/telegram`, (req, res) => {
      this.bot
        .handleUpdate(req.body, res)
        .then(() => {
          if (!res.finished) {
            res.end();
          }
        })
        .catch(err => {
          console.error("TG webhook error", err);
          res.writeHead(500);
          res.end();
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
