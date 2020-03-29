import { Meteor } from "meteor/meteor";
import { Random } from "meteor/random";
import { resetDatabase } from "meteor/xolvio:cleaner";

import { expect } from "chai";

import { ChatNotesCollection } from "../collections";
import "./methods";

describe("saveChatNote() method test", function() {
  before(function() {
    resetDatabase();
  });

  it("should insert new chat note", function() {
    const { saveChatNote } = Meteor.server.method_handlers;

    expect(ChatNotesCollection.find().count()).to.eq(0);

    // mock user
    const user = {
      _id: Random.id(),
      username: "Test User"
    };

    Meteor.user = () => user;

    const context = {
      userId: user._id
    };

    const args = {
      chatId: Random.id(),
      chatNote: "My chat note"
    };

    saveChatNote.call(context, args);

    expect(ChatNotesCollection.find().count()).to.eq(1);

    const chatNote = ChatNotesCollection.findOne();
    expect(chatNote.chatId).to.eq(args.chatId);
    expect(chatNote.text).to.eq(args.chatNote);
    expect(chatNote.userId).to.eq(user._id);
    expect(chatNote.username).to.eq(user.username);
  });
});
