import { Meteor } from "meteor/meteor";
import { check, Match } from "meteor/check";

import { ChatsCollection, ChatNotesCollection } from "../collections";
import { MessagesCollection } from "../collections";

Meteor.publish("chats", function(name, options) {
  check(name, Match.Maybe(String));
  check(options, Object);

  if (!this.userId) {
    return this.ready();
  }

  let filters = {};

  if (name) {
    filters = {
      name: { $regex: name, $options: "i" }
    };
  }

  return ChatsCollection.find(filters, options);
});

Meteor.publish("messages", function({ chatId, limit }) {
  check(limit, Number);

  if (!this.userId || !chatId) {
    return this.ready();
  }
  return MessagesCollection.find(
    { chatId, status: { $ne: "removed" } },
    { sort: { createdAt: -1 }, limit }
  );
});

Meteor.publish("chatNotes", function(chatId) {
  check(chatId, String);

  if (!this.userId) {
    return this.ready();
  }

  return ChatNotesCollection.find({ chatId });
});
