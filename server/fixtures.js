import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import { ContactsCollection } from "../modules/contacts/collections";
import { MessagesCollection } from "../modules/messages/collections";

if (Meteor.users.find().count() === 0) {
  Accounts.createUser({ username: "omnisend", password: "omnisend" });

  const contacts = [
    {
      avatar: "https://material-ui.com/static/images/avatar/1.jpg",
      name: "China",
      lastMessageTrimmed: "how are you",
      channels: ["whatsapp", "telegram"]
    },
    {
      avatar: "https://material-ui.com/static/images/avatar/2.jpg",
      name: "Mura",
      lastMessageTrimmed: ""
    },
    {
      avatar: "https://material-ui.com/static/images/avatar/3.jpg",
      name: "Nadya",
      lastMessageTrimmed: ""
    }
  ];

  const messages = [
    {
      message: "Hi",
      channel: "whatsapp"
    },
    {
      message: "how are you",
      channel: "telegram"
    }
  ];

  const contactId = contacts.map(contact => ContactsCollection.insert(contact))[0];

  messages.forEach(message => {
    message.contactId = contactId;
    const messageId = MessagesCollection.insert(message);

    ContactsCollection.update(
      {
        _id: contactId
      },
      {
        $set: {
          lastMessageId: messageId
        }
      }
    );
  });
}
