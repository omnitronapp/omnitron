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

    bot.on("text", ctx => {
      const { message } = ctx;

      const date = Date.now();

      const messageData = {
        messageId: message.message_id,
        userId: message.from.id,
        username: message.from.username,
        firstName: message.chat.first_name,
        chatId: message.chat.id,
        date: date,
        text: message.text,
        channel: "telegram"
      };

      this.emit("message", messageData);
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
