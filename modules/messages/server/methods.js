import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import { MessagesCollection, RawMessagesCollection } from "../collections";

import { trimMessage } from "../../utils";
import { ContactsCollection } from "../../contacts/collections";
import { ChatsCollection } from "../../chats/collections";
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

    const existingChat = ChatsCollection.findOne({
      channel: parsedMessage.channel,
      channelChatId: parsedMessage.channelChatId
    });

    let chatId = undefined;
    let contactId = undefined;
    if (existingChat) {
      chatId = existingChat._id;

      const contactEntry = existingChat.contactIds.find(
        item => item.channelContactId === parsedMessage.userId
      );

      if (contactEntry) {
        contactId = contactEntry.contactId;
      }
    }

    if (!existingChat) {
      contactId = ContactsCollection.insert({
        name: parsedMessage.firstName || parsedMessage.username,
        channels: [parsedMessage.channel]
      });

      chatId = ChatsCollection.insert({
        name: parsedMessage.chatName,
        type: "single",
        channel: parsedMessage.channel,
        channelChatId: parsedMessage.channelChatId,
        contactIds: [
          {
            contactId,
            channelContactId: parsedMessage.userId
          }
        ]
      });
    }

    // TODO chat exists but contact not: case when group messages are processed
    if (existingChat && !contactId) {
      // complete this
    }

    const messageId = MessagesCollection.insert({
      ...parsedMessage,
      chatId,
      contactId,
      rawMessageId,
      channel: parsedMessage.channel,
      messageId: parsedMessage.messageId,
      message: parsedMessage.text,
      inbound: true
    });

    ChatsCollection.update(
      { _id: chatId },
      {
        $set: {
          lastMessageId: messageId,
          lastMessageTrimmed: trimMessage(parsedMessage.text),
          latestActiveDate: new Date()
        }
      }
    );

    return {
      chatId,
      contactId,
      messageId,
      rawMessageId
    };
  },
  createMessage({ chatId, message }) {
    check(chatId, String);
    check(message, String);

    if (message === "") {
      return;
    }

    const lastMessage = MessagesCollection.findOne(
      {
        chatId
      },
      {
        sort: {
          createdAt: -1
        }
      }
    );

    const lastUsedChannel = lastMessage ? lastMessage.channel : "omnitron";
    const messageId = MessagesCollection.insert({
      chatId,
      message,
      channel: lastUsedChannel,
      createdAt: new Date()
    });

    ChatsCollection.update(
      {
        _id: chatId
      },
      {
        $set: {
          lastMessageTrimmed: trimMessage(message),
          lastMessageId: messageId
        }
      }
    );

    Transports.sendMessage(lastUsedChannel, chatId, message);
  }
});
