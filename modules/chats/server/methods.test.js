import { Meteor } from "meteor/meteor";
import { Random } from "meteor/random";
import { resetDatabase } from "meteor/xolvio:cleaner";

import sinon from "sinon";
import { expect } from "chai";
import {
  mockUser,
  mockMessage,
  mockChat,
  mockUserWithRole,
  mockParsedMessage,
  mockRawMessage
} from "../../../server/testData";

import { Transports } from "../../transports";
import {
  ChatNotesCollection,
  MessagesCollection,
  ChatsCollection,
  RawMessagesCollection
} from "../collections";
import "./methods";

import { initializeRoles } from "../../users/server/roles";

describe("receiveMessage() method test", () => {
  let channelChatId;
  let chatId;

  beforeEach(() => {
    resetDatabase();

    channelChatId = Random.id();
    channelContactId = Random.id();
    chatId = mockChat("test channel", channelChatId);
  });

  it("should add received message to an existing chat", () => {
    const channel = "test channel";
    const messageText = "Test Message";
    const parsedMessage = mockParsedMessage(channel, channelChatId, messageText);
    const rawMessage = mockRawMessage();

    const { receiveMessage } = Meteor.server.method_handlers;
    const args = { parsedMessage, rawMessage };

    const ids = receiveMessage(args);

    const rawMessageId = RawMessagesCollection.findOne(
      { channel, message: rawMessage },
      { fields: { _id: 1 } }
    )._id;
    const messageId = MessagesCollection.findOne(
      { chatId, channel, message: messageText },
      { fields: { _id: 1 } }
    )._id;

    expect(ids.chatId).to.be.eq(chatId);
    expect(ids.messageId).to.be.eq(messageId);
    expect(ids.rawMessageId).to.be.eq(rawMessageId);
  });

  it("should add received message and add chat", () => {
    const messageText = "Test Message";
    const parsedMessage = mockParsedMessage(undefined, undefined, messageText);
    const rawMessage = mockRawMessage();

    const { receiveMessage } = Meteor.server.method_handlers;
    const args = { parsedMessage, rawMessage };

    const ids = receiveMessage(args);

    const rawMessageId = RawMessagesCollection.findOne(
      { message: rawMessage },
      { fields: { _id: 1 } }
    )._id;
    const messageId = MessagesCollection.findOne({ message: messageText }, { fields: { _id: 1 } })
      ._id;
    const newChatId = ChatsCollection.findOne({}, { sort: { createdAt: -1 }, fields: { _id: 1 } })
      ._id;

    expect(ids.chatId).to.be.eq(newChatId);
    expect(ids.messageId).to.be.eq(messageId);
    expect(ids.rawMessageId).to.be.eq(rawMessageId);
  });
});

describe("changeMessageStatus() method test", () => {
  beforeEach(() => {
    resetDatabase();
  });

  it("should change message status", () => {
    const messageId = MessagesCollection.insert({
      chatId: Random.id(),
      channel: "test"
    });

    const { changeMessageStatus } = Meteor.server.method_handlers;

    changeMessageStatus({ messageId, status: "read" });

    const message = MessagesCollection.findOne({
      _id: messageId
    });

    expect(message.status).to.eq("read");
  });
});

describe("createMessage() method test", () => {
  let permittedUserId;
  let unpermittedUserId;
  let chatId;

  beforeEach(() => {
    resetDatabase();
    initializeRoles();

    permittedUserId = mockUserWithRole("SEND_MESSAGES");
    unpermittedUserId = mockUser();
    chatId = mockChat();

    sinon.replace(Transports, "sendMessage", sinon.fake());
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should throw an error if user doesn't have permission", () => {
    const { createMessage } = Meteor.server.method_handlers;

    const args = { chatId: Random.id(), message: "Test Message" };
    const invocation = { userId: unpermittedUserId };

    expect(() => {
      createMessage.call(invocation, args);
    }).to.throw(Error, "User doesn't have permission SEND_MESSAGES");
  });

  it("should do nothing if message is empty", () => {
    const { createMessage } = Meteor.server.method_handlers;
    const invocation = { userId: permittedUserId };
    const message = "";
    const args = { chatId, message };

    createMessage.call(invocation, args);

    const emptyMessage = MessagesCollection.findOne({ chatId, message });
    expect(emptyMessage).to.be.undefined;
  });

  it("should send message", () => {
    const { createMessage } = Meteor.server.method_handlers;

    const message = "test message";

    const invocation = { userId: permittedUserId };
    const args = { chatId, message };

    createMessage.call(invocation, args);

    const messageId = MessagesCollection.findOne(
      {
        message
      },
      {
        fields: {
          _id: 1
        }
      }
    )._id;

    expect(Transports.sendMessage.calledWith("omnitron", chatId, messageId, message)).to.be.true;
  });

  it("should throw an error if chat not found", () => {
    chatId = Random.id();
    message = "test message";

    const { createMessage } = Meteor.server.method_handlers;

    const invocation = { userId: permittedUserId };
    const args = { chatId, message };

    expect(() => {
      createMessage.call(invocation, args);
    }).to.throw(Error, "Chat not found");
  });
});

describe("setReadMessages() method test", () => {
  let userId;
  let chatId;

  beforeEach(() => {
    resetDatabase();

    userId = mockUser();
    chatId = mockChat();

    mockMessage(chatId, "test message 1", "test");
    mockMessage(chatId, "test message 2", "test");
    mockMessage(chatId, "test message 3", "test");
    mockMessage(chatId, "test message 4", "test");
  });

  it("should throw an error if chat not found", () => {
    const { setReadMessages } = Meteor.server.method_handlers;

    const invocation = { userId };
    chatId = Random.id();

    expect(() => {
      setReadMessages.call(invocation, chatId);
    }).to.throw(Error, "Chat not found");
  });

  it("should update chat readMessage by adding userId and messages read count", () => {
    const { setReadMessages } = Meteor.server.method_handlers;

    ChatsCollection.update({ _id: chatId }, { $set: { messagesCount: 4 } });

    const invocation = { userId };
    setReadMessages.call(invocation, chatId);

    const { readMessages } = ChatsCollection.findOne(
      { _id: chatId },
      { fields: { readMessages: 1 } }
    );

    expect(readMessages).be.eql([
      {
        userId,
        count: 4
      }
    ]);
  });
});

describe("saveChatNote() method test", () => {
  let userId;
  let chatId;
  beforeEach(() => {
    resetDatabase();
    userId = mockUser();
    chatId = mockChat();
  });

  it("should insert new chat note", () => {
    const context = {
      userId
    };

    const { saveChatNote } = Meteor.server.method_handlers;

    expect(ChatNotesCollection.find().count()).to.eq(0);

    const args = {
      chatId,
      chatNote: "My chat note"
    };
    saveChatNote.call(context, args);

    expect(ChatNotesCollection.find().count()).to.eq(1);

    const chatNote = ChatNotesCollection.findOne();
    expect(chatNote.chatId).to.eq(args.chatId);
    expect(chatNote.text).to.eq(args.chatNote);
    expect(chatNote.userId).to.eq(userId);
  });

  it("should throw an error if chat not found", () => {
    const context = {
      userId
    };

    const { saveChatNote } = Meteor.server.method_handlers;

    expect(ChatNotesCollection.find().count()).to.eq(0);

    const args = {
      chatId: Random.id(),
      chatNote: "My chat note"
    };
    expect(() => {
      saveChatNote.call(context, args);
    }).to.throw(Error, "Chat not found");
  });
});

describe("removeMessage() method test", () => {
  let permittedUserId;
  let unpermittedUserId;

  beforeEach(() => {
    resetDatabase();
    initializeRoles();
    permittedUserId = mockUserWithRole("REMOVE_MESSAGES");
    unpermittedUserId = mockUser();
  });

  it("should throw error if user doesn't have permission", () => {
    const messageId = Random.id();
    const invocation = {
      unpermittedUserId
    };

    const { removeMessage } = Meteor.server.method_handlers;

    expect(() => {
      removeMessage.call(invocation, messageId);
    }).to.throw(Error, "User doesn't have permission REMOVE_MESSAGES");
  });

  it("should throw error if message is not found", () => {
    const messageId = Random.id();
    const { removeMessage } = Meteor.server.method_handlers;

    const invocation = {
      userId: permittedUserId
    };
    expect(() => {
      removeMessage.call(invocation, messageId);
    }).to.throw(Error, `Message with id ${messageId} not found`);
  });

  it("should throw error if message status is not error", () => {
    const messageId = MessagesCollection.insert({
      chatId: Random.id(),
      channel: "test",
      status: "delivered"
    });

    const { removeMessage } = Meteor.server.method_handlers;

    const invocation = {
      userId: permittedUserId
    };
    expect(() => {
      removeMessage.call(invocation, messageId);
    }).to.throw(Error, `Only error messages can be deleted`);
  });

  it("should remove message if it has error status", () => {
    const messageId = MessagesCollection.insert({
      chatId: Random.id(),
      channel: "test",
      status: "error"
    });

    const { removeMessage } = Meteor.server.method_handlers;

    const invocation = {
      userId: permittedUserId
    };

    removeMessage.call(invocation, messageId);

    const messageDoc = MessagesCollection.findOne({
      _id: messageId
    });

    expect(messageDoc.status).to.eq("removed");
  });
});

describe("resendMessage() method test", () => {
  let permittedUserId;
  let unpermittedUserId;

  beforeEach(() => {
    resetDatabase();
    initializeRoles();

    permittedUserId = mockUserWithRole("SEND_MESSAGES");
    unpermittedUserId = mockUser();

    sinon.replace(Transports, "sendMessage", sinon.fake());
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should resend the message if it has error status", () => {
    const chatId = Random.id();
    const messageId = MessagesCollection.insert({
      chatId,
      channel: "testChannel",
      status: "error",
      message: "Test Message"
    });

    const { resendMessage } = Meteor.server.method_handlers;

    const invocation = {
      userId: permittedUserId
    };

    resendMessage.call(invocation, messageId);

    expect(Transports.sendMessage.calledWith("testChannel", chatId, messageId, "Test Message")).to
      .be.true;
  });

  it("should throw an error if user doesn't have permission", () => {
    const { resendMessage } = Meteor.server.method_handlers;

    const messageId = Random.id();
    const invocation = { userId: unpermittedUserId };

    expect(() => {
      resendMessage.call(invocation, messageId);
    }).to.throw(Error, "User doesn't have permission SEND_MESSAGES");
  });

  it("should throw an error if message isn't an error", () => {
    const chatId = Random.id();
    const messageId = MessagesCollection.insert({
      chatId,
      channel: "testChannel",
      status: "sent",
      message: "Test Message"
    });

    const { resendMessage } = Meteor.server.method_handlers;

    const invocation = {
      userId: permittedUserId
    };

    expect(() => {
      resendMessage.call(invocation, messageId);
    }).to.throw(Error, "Only error messages can be resent");
  });
});

describe("recordMessageId() method test", () => {
  let chatId;
  let messageId;

  beforeEach(() => {
    resetDatabase();
    chatId = mockChat();
    messageId = mockMessage(chatId, "test");
  });

  it("should record channelMessageId to Message", () => {
    const { recordMessageId } = Meteor.server.method_handlers;
    const channelMessageId = Random.id();

    const args = { internalMessageId: messageId, channelMessageId };

    recordMessageId(args);

    const message = MessagesCollection.findOne(
      {
        _id: messageId
      },
      {
        fields: {
          messageId: 1
        }
      }
    );

    expect(message.messageId).to.be.eq(channelMessageId);
  });

  it("should throw an error if message not found", () => {
    const { recordMessageId } = Meteor.server.method_handlers;
    const channelMessageId = Random.id();
    const messageId = Random.id();

    const args = { internalMessageId: messageId, channelMessageId };

    expect(() => {
      recordMessageId(args);
    }).to.throw(Error, `Message with id ${messageId} not found`);
  });
});

describe("transferChat() method test", () => {
  let userId;
  let chatId;

  beforeEach(() => {
    resetDatabase();

    userId = mockUser();
    chatId = mockChat();
  });

  it("should change user for chat", () => {
    const { transferChat } = Meteor.server.method_handlers;

    transferChat({ userId, chatId });

    const chat = ChatsCollection.findOne({ _id: chatId }, { fields: { userId: 1 } });

    expect(chat.userId).to.be.eq(userId);
  });

  it("should throw an error if userId is incorrect", () => {
    userId = Random.id();
    const { transferChat } = Meteor.server.method_handlers;

    expect(() => {
      transferChat({ userId, chatId });
    }).to.throw(Error, `User with id ${userId} not found`);
  });

  it("should throw an error if chatId is incorrect", () => {
    chatId = Random.id();
    const { transferChat } = Meteor.server.method_handlers;

    expect(() => {
      transferChat({ userId, chatId });
    }).to.throw(Error, `Chat with id ${chatId} not found`);
  });
});
