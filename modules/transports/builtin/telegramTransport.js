import { EventEmitter } from "events";

const Telegraf = require("telegraf");

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
    const bot = new Telegraf(credentials.token);

    bot.on(["photo", "document"], ctx => {
      const { message } = ctx;
      const previewPhotoId = message.photo[0].file_id;
      const photoId = message.photo[message.photo.length - 1].file_id;

      const retrieveFilesPromises = [
        bot.telegram.getFileLink(previewPhotoId),
        bot.telegram.getFileLink(photoId)
      ];

      Promise.all(retrieveFilesPromises)
        .then(photoLinks => {
          const messageData = {
            messageId: message.message_id,
            userId: message.from.id,
            username: message.from.username,
            firstName: message.chat.first_name,
            chatId: message.chat.id,
            date: Date.now(),
            text: message.text,
            type: "photo",
            previewPhoto: photoLinks[0],
            photo: photoLinks[1],
            channel: "telegram"
          };

          this.emit("message", {
            parsedMessage: messageData,
            rawMessage: message
          });
        })
        .catch(err => {
          console.error("Could not retrieve photo links from telegram", err.message);
        });
    });

    bot.on("text", ctx => {
      const { message } = ctx;

      const date = Date.now();

      const messageData = {
        messageId: message.message_id,
        userId: message.from.id,
        username: message.from.username,
        firstName: message.chat.first_name,
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

    bot.launch();

    this.credentials = credentials;
    this.bot = bot;
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
      this.bot.stop();
    }
  }
}
