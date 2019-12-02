import SimpleSchema from "simpl-schema";

export const ChatSchema = new SimpleSchema({
  name: {
    type: String
  },
  type: {
    type: String,
    allowedValues: ["single", "group"],
    defaultValue: "single"
  },
  channel: {
    type: String
  },
  channelChatId: {
    type: String
  },
  contactIds: {
    type: Array,
    optional: true
  },
  "contactIds.$": {
    type: Object
  },
  "contactIds.$.contactId": {
    type: String
  },
  "contactIds.$.channelContactId": {
    type: SimpleSchema.oneOf(String, Number)
  },
  lastMessageTrimmed: {
    type: String,
    optional: true
  },
  lastMessageId: {
    type: String,
    optional: true
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
