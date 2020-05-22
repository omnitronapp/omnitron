import { Meteor } from "meteor/meteor";

Meteor.publish("currentUser", function() {
  if (!this.userId) {
    this.ready();
    return;
  }

  return Meteor.users.find({ _id: this.userId }, { fields: { services: 0 } });
});

Meteor.publish("users", function() {
  if (!this.userId) {
    this.ready();
    return;
  }

  return Meteor.users.find({ active: { $ne: false } }, { fields: { services: 0 } });
});

Meteor.publish(null, function() {
  if (this.userId) {
    return Meteor.roleAssignment.find({ "user._id": this.userId });
  } else {
    this.ready();
  }
});
