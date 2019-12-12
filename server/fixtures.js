import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import { ContactsCollection } from "../modules/contacts/collections";
import { MessagesCollection } from "../modules/messaging/collections";

if (Meteor.users.find().count() === 0) {
  Accounts.createUser({ username: "omnitron", password: "omnitron" });

  //   const contacts = [
  //     {
  //       avatar: "https://material-ui.com/static/images/avatar/1.jpg",
  //       name: "China",
  //       lastMessageTrimmed: "how are you",
  //       channels: ["whatsapp", "telegram"]
  //     },
  //     {
  //       avatar: "https://material-ui.com/static/images/avatar/2.jpg",
  //       name: "Mura",
  //       lastMessageTrimmed: ""
  //     },
  //     {
  //       avatar: "https://material-ui.com/static/images/avatar/3.jpg",
  //       name: "Nadya",
  //       lastMessageTrimmed: ""
  //     },
  //     {
  //       avatar: "https://material-ui.com/static/images/avatar/3.jpg",
  //       name: "Vlad",
  //       lastMessageTrimmed: ""
  //     },
  //     {
  //       avatar: "https://material-ui.com/static/images/avatar/3.jpg",
  //       name: "Jack",
  //       lastMessageTrimmed: ""
  //     },
  //     {
  //       avatar: "https://material-ui.com/static/images/avatar/3.jpg",
  //       name: "Natasha",
  //       lastMessageTrimmed: ""
  //     },
  //     {
  //       avatar: "https://material-ui.com/static/images/avatar/3.jpg",
  //       name: "Bob",
  //       lastMessageTrimmed: ""
  //     },
  //     {
  //       avatar: "https://material-ui.com/static/images/avatar/3.jpg",
  //       name: "Ren",
  //       lastMessageTrimmed: ""
  //     },
  //     {
  //       avatar: "https://material-ui.com/static/images/avatar/3.jpg",
  //       name: "Ron",
  //       lastMessageTrimmed: ""
  //     },
  //     {
  //       avatar: "https://material-ui.com/static/images/avatar/3.jpg",
  //       name: "Max",
  //       lastMessageTrimmed: ""
  //     },
  //     {
  //       avatar: "https://material-ui.com/static/images/avatar/3.jpg",
  //       name: "Mark",
  //       lastMessageTrimmed: ""
  //     },
  //     {
  //       avatar: "https://material-ui.com/static/images/avatar/3.jpg",
  //       name: "Tor",
  //       lastMessageTrimmed: ""
  //     },
  //     {
  //       avatar: "https://material-ui.com/static/images/avatar/3.jpg",
  //       name: "Azamat",
  //       lastMessageTrimmed: ""
  //     },
  //     {
  //       avatar: "https://material-ui.com/static/images/avatar/3.jpg",
  //       name: "Abay",
  //       lastMessageTrimmed: ""
  //     },
  //     {
  //       avatar: "https://material-ui.com/static/images/avatar/3.jpg",
  //       name: "Abylay",
  //       lastMessageTrimmed: ""
  //     },
  //     {
  //       avatar: "https://material-ui.com/static/images/avatar/3.jpg",
  //       name: "Aizhan",
  //       lastMessageTrimmed: ""
  //     }
  //   ];

  //   const messages = [
  //     {
  //       message: "Hi",
  //       channel: "whatsapp",
  //       inbound: true
  //     },
  //     {
  //       message: "how are you",
  //       channel: "telegram",
  //       inbound: true
  //     }
  //   ];

  //   const contactId = contacts.map(contact => ContactsCollection.insert(contact))[0];

  //   messages.forEach(message => {
  //     message.contactId = contactId;
  //     const messageId = MessagesCollection.insert(message);

  //     ContactsCollection.update(
  //       {
  //         _id: contactId
  //       },
  //       {
  //         $set: {
  //           lastMessageId: messageId
  //         }
  //       }
  //     );
  //   });
}
