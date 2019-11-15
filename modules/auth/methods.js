import { Meteor } from "meteor/meteor";
import { Random } from "meteor/random";
import { check } from "meteor/check";
import { Accounts } from "meteor/accounts-base";

import { ValidatedMethod } from "meteor/mdg:validated-method";

export const createUser = new ValidatedMethod({
  name: "users.methods.create",
  validate({ username, role }) {
    check(username, String);
    check(role, String);
  },
  run({ username, role }) {
    const password = Random.secret(8);
    return Accounts.createUser({ username, password, profile: { role } });
  }
});

export const updateUser = new ValidatedMethod({
  name: "users.methods.update",
  validate({ username, profile }) {
    check(username, String);
    check(profile, Object);
  },
  run({ username, profile }) {
    Meteor.users.update(
      {
        username
      },
      {
        $set: {
          profile
        }
      }
    );
  }
});
