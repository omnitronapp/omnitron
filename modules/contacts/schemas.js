import SimpleSchema from "simpl-schema";

export const ContactSchema = new SimpleSchema({
  name: {
    type: String
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
  }
});
