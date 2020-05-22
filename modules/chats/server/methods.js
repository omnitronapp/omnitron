import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import { MessagesCollection, ChatNotesCollection, RawMessagesCollection } from "../collections";

import { trimMessage } from "../../utils";
import { ContactsCollection } from "../../contacts/collections";
import { ChatsCollection } from "../../chats/collections";
import { Transports } from "../../transports";

import { distributorInterface } from "../../distribution/server/";

Meteor.methods({
  receiveMessage({ parsedMessage, rawMessage }) {
    check(parsedMessage, Object);
    check(rawMessage, Object);
    check(this.userId, String);
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

    // Chat exists
    if (existingChat) {
      chatId = existingChat._id;

      const contactEntry = existingChat.contactIds.find(
        item => item.channelContactId === parsedMessage.userId
      );

      if (contactEntry) {
        contactId = contactEntry.contactId;
      }
    }

    // Chat does not exists, create new one
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

      distributorInterface.distributeChat(chatId);
    }

    // Chat exists, but contact does not: case in group messages
    if (existingChat && !contactId) {
      contactId = ContactsCollection.insert({
        name: parsedMessage.firstName || parsedMessage.username,
        channels: [parsedMessage.channel]
      });

      const contactIds = [
        ...existingChat.contactIds,
        {
          contactId,
          channelContactId: parsedMessage.userId
        }
      ];

      ChatsCollection.update(
        { _id: chatId },
        {
          $set: {
            type: "group",
            contactIds
          }
        }
      );
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
        },
        $inc: {
          messagesCount: 1
        }
      }
    );

    // update all inbound message statuses to `read` except for error messages
    MessagesCollection.update(
      {
        chatId,
        inbound: false,
        status: {
          $in: ["created", "sent", "delivered"]
        },
        createdAt: {
          $lte: new Date()
        }
      },
      {
        $set: {
          status: "read"
        }
      },
      {
        multi: true
      }
    );

    return {
      chatId,
      contactId,
      messageId,
      rawMessageId
    };
  },
  changeMessageStatus({ messageId, status, errorMessage }) {
    MessagesCollection.update(
      // update by internal or external message id
      { $or: [{ _id: messageId }, { messageId }] },
      {
        $set: {
          status,
          errorMessage
        }
      }
    );
  },
  createMessage({ chatId, message }) {
    check(chatId, String);
    check(message, String);
    check(this.userId, String);

    if (message === "") {
      return;
    }

    const userId = this.userId;

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

    //add readMessages
    const chat = ChatsCollection.findOne(
      { _id: chatId },
      { fields: { messagesCount: 1, readMessages: 1 } }
    );

    let { readMessages = [], messagesCount } = chat;

    const findUser = readMessages.findIndex(item => item.userId === userId);

    messagesCount += 1;

    if (findUser >= 0) {
      readMessages[findUser].count = messagesCount;
    } else {
      readMessages.push({
        userId: userId,
        count: messagesCount
      });
    }
    //end readMessages

    ChatsCollection.update(
      {
        _id: chatId
      },
      {
        $set: {
          lastMessageTrimmed: trimMessage(message),
          lastMessageId: messageId,
          readMessages
        },
        $inc: {
          messagesCount: 1
        }
      }
    );

    Meteor.defer(() => {
      const chat = ChatsCollection.findOne(
        { _id: chatId },
        { fields: { messagesCount: 1, readMessages: 1 } }
      );

      let { readMessages = [], messagesCount } = chat;

      const findUser = readMessages.findIndex(item => item.userId === userId);

      if (findUser >= 0) {
        readMessages[findUser].count = messagesCount;
      } else {
        readMessages.push({
          userId: userId,
          count: messagesCount
        });
      }
    });

    Transports.sendMessage(lastUsedChannel, chatId, messageId, message);
  },
  setReadMessages: function(chatId) {
    check(this.userId, String);
    check(chatId, String);

    const userId = this.userId;

    const chat = ChatsCollection.findOne(
      { _id: chatId },
      { fields: { messagesCount: 1, readMessages: 1 } }
    );

    let { readMessages = [], messagesCount = 0 } = chat;

    const findUser = readMessages.findIndex(item => item.userId === userId);

    if (findUser >= 0) {
      readMessages[findUser].count = messagesCount;
    } else {
      readMessages.push({
        userId: userId,
        count: messagesCount
      });
    }

    return ChatsCollection.update({ _id: chatId }, { $set: { readMessages } });
  },
  saveChatNote({ chatId, chatNote }) {
    check(chatId, String);
    check(chatNote, String);
    check(this.userId, String);

    const user = Meteor.user();

    ChatNotesCollection.insert({
      chatId,
      text: chatNote,
      username: user.username,
      userId: this.userId
    });
  },
  removeMessage(messageId) {
    check(this.userId, String);
    check(messageId, String);

    const message = MessagesCollection.findOne({ _id: messageId }, { fields: { status: 1 } });
    if (message) {
      if (message.status == "error") {
        MessagesCollection.update(
          { _id: messageId },
          { $set: { status: "removed" }, $unset: { errorMessage: "" } }
        );
      } else {
        throw new Error("Only error messages can be deleted");
      }
    } else {
      throw new Error(`Message with id ${messageId} not found`);
    }
  },
  resendMessage(messageId) {
    check(this.userId, String);
    check(messageId, String);

    const message = MessagesCollection.findOne(
      { _id: messageId },
      { fields: { status: 1, chatId: 1, channel: 1, message: 1 } }
    );

    if (message.status == "error") {
      Transports.sendMessage(message.channel, message.chatId, messageId, message.message);
    }
  },
  recordMessageSid({ internalMessageId, channelMessageId }) {
    check(internalMessageId, String);
    check(channelMessageId, String);

    const message = MessagesCollection.findOne({ _id: internalMessageId });

    if (message)
      return MessagesCollection.update(
        { _id: internalMessageId },
        { $set: { messageId: channelMessageId } }
      );
  }
});
