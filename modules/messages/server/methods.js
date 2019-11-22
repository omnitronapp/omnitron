import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import { MessagesCollection } from "../collections";

import { trimMessage } from "../../utils";
import { ContactsCollection } from "../../contacts/collections";
import { UserChannels } from "../../channels/collection";
import { transports } from "../../transports";

Meteor.methods({
  receiveMessage(messageData) {
    check(messageData, Object);
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
      channel: messageData.channel,
      chatId: messageData.chatId,
      channelContactId: messageData.contactId
    });

    let contactId = undefined;
    if (existingUserChannel) {
      contactId = existingUserChannel.contactId;
    } else {
      contactId = ContactsCollection.insert({
        name: messageData.firstName || messageData.username,
        channels: [messageData.channel]
      });

      UserChannels.insert({
        channel: messageData.channel,
        contactId,
        channelContactId: messageData.userId,
        chatId: messageData.chatId
      });
    }

    const messageId = MessagesCollection.insert({
      contactId,
      channel: messageData.channel,
      messageId: messageData.messageId,
      message: messageData.text
    });

    ContactsCollection.update(
      { _id: contactId },
      {
        $set: {
          lastMessageId: messageId,
          lastMessageTrimmed: trimMessage(messageData.text)
        }
      }
    );

    return {
      contactId,
      messageId
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

    transports.sendMessage(lastUsedChannel, contactId, message);
  }
});
