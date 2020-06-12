import { Meteor } from "meteor/meteor";

// contains mocked users/transports
function mockUser() {
  const userId = Accounts.createUser({
    username: "testUser",
    password: "testPassword"
  });

  Meteor.user = () => Meteor.users.findOne({ _id: userId });
  Meteor.userId = () => userId;

  return userId;
}

function mockTransport() {
  // TODO: complete this
}

export { mockUser, mockTransport };
