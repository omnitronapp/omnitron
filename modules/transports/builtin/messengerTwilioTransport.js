import { EventEmitter } from "events";
import Twilio from "twilio";
import request from "request";

import { Rest } from "../../rest/server";

export class Transport extends EventEmitter {
	constructor() {
		super();

		this.name = "messenger";
		this.channel = "messenger";
		this.title = "Facebook (Twilio)";
		this.linkToInstructions = "https://www.twilio.com/docs/sms/channels";

		this.handlersCreated = false;
	}

	requireCredentials() {
		return [
			{
				key: "from",
				title: "From page id (with 'messenger:' prefix)"
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

	webhookEndpoints() {
		return [
			{
				key: "webhook_url",
				title: "Webhook URL",
				url: `/webhook/messenger`,
				method: "POST"
			},
			{
				key: "webhook_status_url",
				title: "Webhook status URL",
				url: `/webhook/messenger/status`,
				method: "POST"
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

		const statusWebhook = this.webhookEndpoints().find(
			webhook => webhook.key === "webhook_status_url"
		);

		const mainWebhook = this.webhookEndpoints().find(webhook => webhook.key === "webhook_url");

		Rest.post(statusWebhook.url, (req, res) => {
			// TODO: Handle status message
			res.send({});
		});

		const imageTypes = ["image/jpeg", "image/gif", "image/png", "image/bmp"];
		const applicationTypes = ["application/pdf"];
		const audioTypes = [
			"audio/basic",
			"audio/L24",
			"audio/mp4",
			"audio/mpeg",
			"audio/ogg",
			"audio/vorbis",
			"audio/vnd.rn-realaudio",
			"audio/vnd.wave",
			"audio/3gpp",
			"audio/3gpp2",
			"audio/ac3",
			"audio/vnd.wave",
			"audio/webm",
			"audio/amr-nb",
			"audio/amr"
		];

		const videoTypes = [
			"video/mpeg",
			"video/mp4",
			"video/quicktime",
			"video/webm",
			"video/3gpp",
			"video/3gpp2",
			"video/3gpp-tt",
			"video/H261",
			"video/H263",
			"video/H263-1998",
			"video/H263-2000",
			"video/H264"
		];

		Rest.post(
			mainWebhook.url,
			Meteor.bindEnvironment((req, res) => {
				const message = req.body;

				const response = new Twilio.twiml.MessagingResponse();

				const date = Date.now();

				const username = message.From.replace("messenger:", "");
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
					channel: "messenger"
				};

				if (message.NumMedia) {
					for (let i = 0; i < message.NumMedia; i++) {
						const mediaType = message[`MediaContentType${i}`];
						if (imageTypes.includes(mediaType)) {
							messageData.type = "image";
							messageData.image = {
								previewImage: message[`MediaUrl${i}`],
								image: message[`MediaUrl${i}`]
							};
						} else if (applicationTypes.includes(mediaType)) {
							messageData.type = "document";
							messageData.document = {
								link: message[`MediaUrl${i}`],
								title: message.Body,
								size: 1024 * 1024 // take random file size
							};
						} else if (audioTypes.includes(mediaType)) {
							messageData.type = "voice";
							messageData.voice = {
								link: message[`MediaUrl${i}`],
								duration: 0,
								type: mediaType,
								size: 0
							};
						} else if (videoTypes.includes(mediaType)) {
							messageData.type = "video";
							messageData.video = {
								link: message[`MediaUrl${i}`],
								duration: 0,
								type: mediaType,
								size: 0
							};
						}
					}
				}

				if (messageData.document) {
					request.head(messageData.document.link, (err, response) => {
						const fileSize = response.headers["content-length"];

						messageData.document.size = fileSize;

						this.emit("message", {
							parsedMessage: messageData,
							rawMessage: message
						});
					});
				} else if (messageData.voice) {
					request.head(messageData.voice.link, (err, response) => {
						const fileSize = response.headers["content-length"];
						messageData.voice.size = fileSize;

						this.emit("message", {
							parsedMessage: messageData,
							rawMessage: message
						});
					});
				} else {
					this.emit("message", {
						parsedMessage: messageData,
						rawMessage: message
					});
				}

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
					.then(
						message => {
							console.log(message.sid);
							message.status = "sent";
						}
					)
					.catch(
						err => {
							console.error(err);
							message.status = "error";
						}
					)
					.done(resolve);
			}
		});
	}

	stop() {
		this.client = null;
	}
}
