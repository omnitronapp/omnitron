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
      lastMessage: ""
    },
    {
      avatar: "https://material-ui.com/static/images/avatar/2.jpg",
      name: "Mura",
      lastMessage: ""
    },
    {
      avatar: "https://material-ui.com/static/images/avatar/3.jpg",
      name: "Nadya",
      lastMessage: ""
    }
  ];

  const messages = [
    {
      message: "Hi",
      type: "whatsapp",
      createdDate: new Date()
    },
    {
      message: "how are you",
      type: "telegram",
      createdDate: new Date()
    }
  ];

  const contactId = contacts.map(contact => ContactsCollection.insert(contact))[0];

  messages.forEach(message => {
    message.contactId = contactId;
    MessagesCollection.insert(message);
  });
}
