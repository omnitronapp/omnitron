import { EventEmitter } from "events";
import url from "url";

const Telegraf = require("telegraf");

import { Rest } from "../../rest/server/";
import { MessagesCollection, ChatsCollection } from "../../chats/collections";

export class Transport extends EventEmitter {
	constructor() {
		super();

		this.name = "telegram";
		this.channel = "telegram";
		this.title = "Telegram";
		this.linkToInstructions = "https://core.telegram.org/bots";

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

	webhookEndpoints() {
		return [
			{
				key: "webhook_url",
				title: "Webhook URL",
				url: `/webhook/telegram`,
				method: "POST"
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

	async configureHandlers() {
		await this.bot.telegram.deleteWebhook();

		const mainWebhook = this.webhookEndpoints().find(webhook => webhook.key === "webhook_url");

		await this.bot.telegram.setWebhook(url.resolve(process.env.ROOT_URL, mainWebhook.url));
		this.configureWebhook();

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
						chatName: message.chat.type === "private" ? message.chat.username : message.chat.title,
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

		this.bot.on("video", ctx => {
			const { message } = ctx;

			this.bot.telegram.getFileLink(message.video.file_id).then(link => {
				const messageData = {
					messageId: message.message_id,
					userId: message.from.id,
					username: message.from.username,
					firstName: message.from.first_name,
					chatName: message.chat.type === "private" ? message.chat.username : message.chat.title,
					channelChatId: message.chat.id,
					date: new Date(),
					text: message.text,
					type: "video",
					channel: "telegram",
					video: {
						link,
						size: message.video.file_size,
						type: message.video.mime_type,
						duration: message.video.duration
					}
				};

				this.emit("message", {
					parsedMessage: messageData,
					rawMessage: message
				});
			});
		});
	}

	configureWebhook() {
		if (this.webhookDefined) {
			return;
		}
		this.webhookDefined = true;

		const mainWebhook = this.webhookEndpoints().find(webhook => webhook.key === "webhook_url");

		Rest.post(mainWebhook.url, (req, res) => {
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
				return this.bot.telegram.sendMessage(chatId, message)
					.then(
						() => {
							console.log(message)
							resolve()
						},
						() => {
							reject()
						}
					);
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
