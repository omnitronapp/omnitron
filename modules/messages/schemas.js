import SimpleSchema from "simpl-schema";

export const MessageSchema = new SimpleSchema({
  chatId: {
    type: String
  },
  contactId: {
    type: String,
    optional: true
  },
  channel: {
    type: String
  },
  type: {
    type: String,
    optional: true,
    defaultValue: "plain"
  },
  message: {
    type: String,
    optional: true
  },
  userId: {
    type: String,
    optional: true
  },
  username: {
    type: String,
    optional: true
  },
  firstName: {
    type: String,
    optional: true
  },
  rawMessageId: {
    type: String,
    optional: true
  },
  messageId: {
    type: String,
    optional: true
  },
  createdAt: {
    type: Date,
    autoValue: function() {
      if (this.isInsert) return new Date();
    },
    optional: true
  },
  updatedAt: {
    type: Date,
    autoValue: function() {
      return new Date();
    },
    optional: true
  },
  inbound: {
    type: Boolean,
    defaultValue: false,
    optional: true
  }
});
