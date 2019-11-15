import { Meteor } from "meteor/meteor";
import { MessagesCollection } from "../collections";

Meteor.publish("messages", function({ contactId }) {
  if (!this.userId || !contactId) {
    return this.ready();
  }

  return MessagesCollection.find({ contactId });
});
