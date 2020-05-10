import { Meteor } from "meteor/meteor";

import { ChatsCollection } from "../../../chats/collections";
import { DistributionAlgorithms } from "../../collections";

export class RoundRobinAlgorithm {
  getName() {
    return "round-robin";
  }

  // will reconfigure algorithm when user added/removed
  reconfigure() {
    const usersList = Meteor.users
      .find({ active: { $ne: false } }, { fields: { _id: 1, username: 1 } })
      .fetch();

    const userIds = usersList.map(user => user._id);
    const usernames = usersList.map(user => user.username);

    DistributionAlgorithms.update(
      {
        name: this.getName()
      },
      {
        $set: {
          userIds,
          usernames
        }
      }
    );
  }

  getDocInitialFields() {
    const usersList = Meteor.users
      .find({ active: { $ne: false } }, { fields: { _id: 1, username: 1 } })
      .fetch();

    const userIds = usersList.map(user => user._id);
    const usernames = usersList.map(user => user.username);

    return {
      name: this.getName(),
      userIds,
      usernames
    };
  }

  getNextUser() {
    const algDoc = DistributionAlgorithms.findOne(
      { name: this.getName() },
      { fields: { lastUsedUser: 1, userIds: 1 } }
    );

    const { lastUsedUser, userIds } = algDoc;

    let nextUser;
    // first time using this algorithm
    if (!lastUsedUser) {
      nextUser = userIds[0];
    } else {
      const lastUsedUserIndex = userIds.indexOf(lastUsedUser);
      // start next cycle
      if (lastUsedUserIndex >= userIds.length - 1) {
        nextUser = userIds[0];
      } else {
        nextUser = userIds[lastUsedUserIndex + 1];

        if (!nextUser) {
          nextUser = userIds[0];
        }
      }
    }

    return nextUser;
  }

  distribute(chatId) {
    const nextUser = this.getNextUser();

    ChatsCollection.update({ _id: chatId }, { $set: { userId: nextUser } });
    DistributionAlgorithms.update({ name: "round-robin" }, { $set: { lastUsedUser: nextUser } });
  }
}
