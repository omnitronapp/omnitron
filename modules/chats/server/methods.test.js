import { Meteor } from "meteor/meteor";
import { Random } from "meteor/random";
import { resetDatabase } from "meteor/xolvio:cleaner";

import sinon from "sinon";
import { expect } from "chai";
import { mockUser } from "../../../server/testData";

import { Transports } from "../../transports";
import { ChatNotesCollection, MessagesCollection } from "../collections";
import "./methods";

describe("saveChatNote() method test", function() {
  before(function() {
    resetDatabase();
  });

  it("should insert new chat note", function() {
    const userId = mockUser();
    const context = {
      userId
    };

    const { saveChatNote } = Meteor.server.method_handlers;

    expect(ChatNotesCollection.find().count()).to.eq(0);

    const args = {
      chatId: Random.id(),
      chatNote: "My chat note"
    };

    saveChatNote.call(context, args);

    expect(ChatNotesCollection.find().count()).to.eq(1);

    const chatNote = ChatNotesCollection.findOne();
    expect(chatNote.chatId).to.eq(args.chatId);
    expect(chatNote.text).to.eq(args.chatNote);
    expect(chatNote.userId).to.eq(userId);
  });
});

describe("changeMessageStatus() method test", function() {
  before(function() {
    resetDatabase();
  });

  it("should change message status", function() {
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

describe("removeMessage() method test", function() {
  let userId;
  before(function() {
    resetDatabase();

    userId = mockUser();
  });

  it("should throw error if message is not found", function() {
    const messageId = Random.id();

    const { removeMessage } = Meteor.server.method_handlers;

    const invocation = {
      userId
    };
    expect(() => {
      removeMessage.call(invocation, messageId);
    }).to.throw(Error, `Message with id ${messageId} not found`);
  });

  it("should throw error if message status is not error", function() {
    const messageId = MessagesCollection.insert({
      chatId: Random.id(),
      channel: "test",
      status: "delivered"
    });

    const { removeMessage } = Meteor.server.method_handlers;

    const invocation = {
      userId
    };
    expect(() => {
      removeMessage.call(invocation, messageId);
    }).to.throw(Error, `Only error messages can be deleted`);
  });

  it("should remove message if it has error status", function() {
    const messageId = MessagesCollection.insert({
      chatId: Random.id(),
      channel: "test",
      status: "error"
    });

    const { removeMessage } = Meteor.server.method_handlers;

    const invocation = {
      userId
    };

    removeMessage.call(invocation, messageId);

    const messageDoc = MessagesCollection.findOne({
      _id: messageId
    });

    expect(messageDoc.status).to.eq("removed");
  });
});

describe("resendMessage() method test", function() {
  let userId;
  before(function() {
    resetDatabase();

    userId = mockUser();
    sinon.replace(Transports, "sendMessage", sinon.fake());
  });

  after(function() {
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
      userId
    };

    resendMessage.call(invocation, messageId);

    expect(Transports.sendMessage.calledWith("testChannel", chatId, messageId, "Test Message")).to
      .be.true;
  });
});
