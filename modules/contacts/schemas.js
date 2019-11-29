import SimpleSchema from "simpl-schema";

export const ContactSchema = new SimpleSchema({
  name: {
    type: String
  },
  lastMessageId: {
    type: String,
    optional: true
  },
  lastMessageTrimmed: {
    type: String,
    optional: true
  },
  avatar: {
    type: String,
    optional: true
  },
  channels: {
    type: Array,
    optional: true
  },
  "channels.$": {
    type: String
  },
  latestActiveDate: {
    type: Date,
    optional: true
  },
  createdAt: {
    type: Date,
    autoValue: function() {
      if (this.isInsert) return new Date();
    }
  },
  updatedAt: {
    type: Date,
    autoValue: function() {
      return new Date();
    }
  }
});
