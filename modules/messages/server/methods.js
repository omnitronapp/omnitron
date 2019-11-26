import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import { MessagesCollection, RawMessagesCollection } from "../collections";

import { trimMessage } from "../../utils";
import { ContactsCollection } from "../../contacts/collections";
import { UserChannels } from "../../channels/collection";
import { Transports } from "../../transports";

Meteor.methods({
  receiveMessage({ parsedMessage, rawMessage }) {
    check(parsedMessage, Object);
    check(rawMessage, Object);

    let rawMessageId = "";

    try {
      rawMessageId = RawMessagesCollection.insert({
        channel: parsedMessage.channel,
        message: rawMessage,
        createdAt: new Date()
      });
    } catch (e) {
      console.error(e);
    }
    /**
      {
        messageId: message_id
        userId: from.id
        username: from.username
        firstName: chat.first_name
        chatId: chat.id
        date: date
        text: text
        channel: "telegram"
      }
     */
    const existingUserChannel = UserChannels.findOne({
      channel: parsedMessage.channel,
      chatId: parsedMessage.chatId,
      channelContactId: parsedMessage.contactId
    });

    let contactId = undefined;
    if (existingUserChannel) {
      contactId = existingUserChannel.contactId;
    } else {
      contactId = ContactsCollection.insert({
        name: parsedMessage.firstName || parsedMessage.username,
        channels: [parsedMessage.channel]
      });

      UserChannels.insert({
        channel: parsedMessage.channel,
        contactId,
        channelContactId: parsedMessage.userId,
        chatId: parsedMessage.chatId
      });
    }

    const messageId = MessagesCollection.insert({
      ...parsedMessage,
      contactId,
      rawMessageId,
      channel: parsedMessage.channel,
      messageId: parsedMessage.messageId,
      message: parsedMessage.text
    });

    ContactsCollection.update(
      { _id: contactId },
      {
        $set: {
          lastMessageId: messageId,
          lastMessageTrimmed: trimMessage(parsedMessage.text)
        }
      }
    );

    return {
      contactId,
      messageId,
      rawMessageId
    };
  },
  createMessage({ contactId, message }) {
    check(contactId, String);
    check(message, String);

    if (message === "") {
      return;
    }

    const lastMessage = MessagesCollection.findOne(
      {
        contactId
      },
      {
        sort: {
          createdDate: -1
        }
      }
    );

    const lastUsedChannel = lastMessage ? lastMessage.channel : "omnisend";
    const messageId = MessagesCollection.insert({
      contactId,
      message,
      channel: lastUsedChannel,
      createdDate: new Date()
    });

    ContactsCollection.update(
      {
        _id: contactId
      },
      {
        $set: {
          lastMessageTrimmed: trimMessage(message),
          lastMessageId: messageId
        }
      }
    );

    Transports.sendMessage(lastUsedChannel, contactId, message);
  }
});
