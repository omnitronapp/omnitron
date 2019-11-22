import { EventEmitter } from "events";

const Telegraf = require("telegraf");

export class Transport extends EventEmitter {
  constructor() {
    super();
  }

  configure() {
    const bot = new Telegraf("1006308549:AAF3arQNDAYaIIT8vN3MsYYY6TCgqdhNVMk");

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
    this.bot = bot;
  }

  sendMessage(chatId, message) {
    return new Promise((resolve, reject) => {
      return this.bot.telegram.sendMessage(chatId, message).then(() => resolve(), () => reject());
    });
  }

  stop() {
    this.bot.stop();
  }
}
