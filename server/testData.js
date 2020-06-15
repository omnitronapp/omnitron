import { Meteor } from "meteor/meteor";
import { Random } from "meteor/random";
import { ChatsCollection, MessagesCollection } from "../modules/chats/collections";
import { random } from "underscore";

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

function mockParsedMessage(
  channel = Random.id(),
  channelChatId = Random.id(),
  message = "Test Message"
) {
  function mockUserId() {
    const result = randomInt(1e9, 1e10 - 1);

    return result;
  }

  function randomInt(a, b) {
    const result = Math.floor(Math.random() * (b - a + 1)) + a;

    return result;
  }

  const parsedMessage = {
    channel: channel,
    channelChatId: channelChatId,
    chatName: "John Doe",
    firstName: "John",
    messageId: randomInt(1, 100),
    text: message,
    userId: mockUserId(),
    username: "john_doe"
  };

  return parsedMessage;
}

function mockRawMessage() {
  const rawMessage = {
    event_id: Random.id(),
    group_id: Random.id(),
    secret: Random.id(),
    type: "test"
  };

  return rawMessage;
}

export {
  mockUser,
  mockUserWithRole,
  mockChat,
  mockMessage,
  mockTransport,
  mockParsedMessage,
  mockRawMessage
};
