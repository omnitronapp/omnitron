import { Meteor } from "meteor/meteor";

import { ChatsCollection } from "../../../chats/collections";
import { DistributionAlgorithms } from "../../collections";

export class RoundRobinAlgorithm {
  getName() {
    return "round-robin";
  }

  getDocInitialFields() {
    const usersList = Meteor.users.find({}, { fields: { _id: 1 } }).map(user => user._id);

    return {
      name: this.getName(),
      usersList
    };
  }

  getNextUser() {
    const algDoc = DistributionAlgorithms.findOne(
      { name: this.getName() },
      { fields: { lastUsedUser: 1, usersList: 1 } }
    );

    const { lastUsedUser, usersList } = algDoc;

    let nextUser;
    // first time using this algorithm
    if (!lastUsedUser) {
      nextUser = usersList[0];
    } else {
      const lastUsedUserIndex = usersList.indexOf(lastUsedUser);
      // start next cycle
      if (lastUsedUserIndex >= usersList.length - 1) {
        nextUser = usersList[0];
      } else {
        nextUser = usersList[lastUsedUserIndex + 1];

        if (!nextUser) {
          nextUser = usersList[0];
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
