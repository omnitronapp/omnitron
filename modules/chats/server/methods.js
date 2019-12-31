import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import { MessagesCollection, ChatNotesCollection, RawMessagesCollection } from "../collections";

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

    Transports.sendMessage(lastUsedChannel, chatId, message);
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
  }
});
