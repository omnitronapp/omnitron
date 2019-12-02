import { Meteor } from "meteor/meteor";
import { MessagesCollection } from "../collections";

Meteor.publish("messages", function({ chatId }) {
  if (!this.userId || !chatId) {
    return this.ready();
  }

  return MessagesCollection.find({ chatId }, { sort: { createdAt: 1 } });
});
