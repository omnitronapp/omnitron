import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import { MessagesCollection } from "../collections";

import { trimMessage } from "../../utils";
import { ContactsCollection } from "../../contacts/collections";
import { sendMessageToChannel } from "../../messaging/services/messagingService";

Meteor.methods({
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

    sendMessageToChannel(contactId, message);
  }
});
