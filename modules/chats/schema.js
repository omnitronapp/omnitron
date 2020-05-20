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
    type: SimpleSchema.oneOf(String, Number)
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
  },
  readMessages: {
    type: Array,
    optional: true,
    defaultValue: []
  },
  "readMessages.$": {
    type: Object
  },
  "readMessages.$.userId": {
    type: String
  },
  "readMessages.$.count": {
    type: Number
  },
  messagesCount: {
    type: Number,
    autoValue: function() {
      if (this.isInsert) {
        return 0;
      }
    }
  }
});

const DocumentSchema = new SimpleSchema({
  title: String,
  link: String,
  size: Number
});

const VoiceSchema = new SimpleSchema({
  link: String,
  duration: Number,
  size: Number,
  type: String
});

const ImageSchema = new SimpleSchema({
  previewImage: String,
  image: String
});

const VideoSchema = new SimpleSchema({
  size: Number,
  type: String,
  duration: Number,
  link: String
});

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
    defaultValue: "plain",
    allowedValues: ["plain", "image", "document", "voice", "video"]
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
  status: {
    type: String,
    optional: true,
    defaultValue: "created",
    allowedValues: ["created", "sent", "error", "delivered", "read", "removed"]
  },
  errorMessage: {
    type: String,
    optional: true
  },
  inbound: {
    type: Boolean,
    defaultValue: false,
    optional: true
  },
  image: {
    type: ImageSchema,
    optional: true
  },
  document: {
    type: DocumentSchema,
    optional: true
  },
  voice: {
    type: VoiceSchema,
    optional: true
  },
  video: {
    type: VideoSchema,
    optional: true
  }
});

export const ChatNoteSchema = new SimpleSchema({
  chatId: {
    type: String
  },
  text: {
    type: String
  },
  username: {
    type: String
  },
  userId: {
    type: String
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
