import { Meteor } from "meteor/meteor";

Meteor.publish("currentUser", function() {
  if (!this.userId) {
    this.ready();
  }

  return Meteor.users.find({ _id: this.userId });
});
