import { Meteor } from "meteor/meteor";
import { Random } from "meteor/random";
import { ChatsCollection, MessagesCollection } from "../modules/chats/collections";

// contains mocked users/transports
function mockUserWithRole(role) {
  const userId = Accounts.createUser({
    username: Random.id(),
    password: Random.id()
  });

  Meteor.user = () => Meteor.users.findOne({ _id: userId });
  Meteor.userId = () => userId;
  Roles.setUserRoles(userId, role);

  return userId;
}

function mockUser() {
  const userId = Accounts.createUser({
    username: Random.id(),
    password: Random.id()
  });

  Meteor.user = () => Meteor.users.findOne({ _id: userId });
  Meteor.userId = () => userId;

  return userId;
}

function mockTransport() {
  // TODO: complete this
}

function mockChat(
  channel = Random.id(),
  channelChatId = Random.id(),
  contactId = Random.id(),
  channelContactId = Random.id()
) {
  const chatId = ChatsCollection.insert({
    name: Random.id(),
    type: "single",
    channel,
    channelChatId,
    contactIds: [
      {
        contactId,
        channelContactId
      }
    ]
  });
  return chatId;
}

function mockMessage(chatId, message, channel = Random.id()) {
  const messageId = MessagesCollection.insert({
    chatId,
    message,
    channel
  });
  return messageId;
}

export { mockUser, mockUserWithRole, mockChat, mockMessage, mockTransport };
