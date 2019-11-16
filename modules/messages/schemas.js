import SimpleSchema from "simpl-schema";

export const MessageSchema = new SimpleSchema({
  contactId: {
    type: String
  },
  channel: {
    type: String
  },
  message: {
    type: String
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
  }
});
