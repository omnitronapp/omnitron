import { Meteor } from "meteor/meteor";
import _ from "underscore";
import { Accounts } from "meteor/accounts-base";
import { ContactsCollection } from "../modules/contacts/collections";
import { MessagesCollection, ChatsCollection } from "../modules/chats/collections";

function randomString() {
  return (
    Math.random()
      .toString(36)
      .substring(2, 15) +
    Math.random()
      .toString(36)
      .substring(2, 15)
  );
}

function randomNumberInRange(min = 1, max = 10000000) {
  return _.random(min, max);
}

if (Meteor.users.find().count() === 0) {
  Accounts.createUser({ username: "omnitron", password: "omnitron" });

  const contacts = [...new Array(5)].map(contact => {
    return {
      name: randomString(),
      avatar: `https://material-ui.com/static/images/avatar/${randomNumberInRange(1, 3)}.jpg`,
      lastMessageTrimmed: randomString(),
      channels: ["whatsapp", "telegram"]
    };
  });

  const messages = [
    {
      message: "Hi",
      channel: "telegram",
      inbound: true
    },
    {
      message: "how are you",
      channel: "telegram",
      inbound: true
    }
  ];

  const contactId = contacts.map(contact => ContactsCollection.insert(contact))[0];

  const chats = [...new Array(2)].map(chat => {
    return {
      type: "single",
      channelChatId: randomNumberInRange(),
      name: randomString(),
      channel: "telegram",
      contactIds: [
        {
          contactId,
          channelContactId: "telegram"
        }
      ]
    };
  });
  const chatId = chats.map(chat => ChatsCollection.insert(chat))[0];

  messages.forEach(message => {
    message = {
      ...message,
      contactId,
      chatId,
      username: contacts[0].name,
      firstName: contacts[0].name
    };
    const messageId = MessagesCollection.insert(message);

    ChatsCollection.update(
      { _id: chatId },
      {
        $inc: {
          messagesCount: 1
        }
      }
    );
  });
}
