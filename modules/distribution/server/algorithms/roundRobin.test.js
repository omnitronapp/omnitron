import { resetDatabase } from "meteor/xolvio:cleaner";
import { Random } from "meteor/random";

import sinon from "sinon";
import { expect } from "chai";
import { mockUser, mockChat } from "../../../../server/testData";
import { RoundRobinAlgorithm } from "./roundRobin";
import { DistributionAlgorithms } from "../../collections";
import { ChatsCollection } from "../../../chats/collections";

describe("reconfigure() function test", () => {
  let userIds = [];
  let roundRobinAlgorithm;

  beforeEach(() => {
    resetDatabase();

    let usersCount = 2;

    for (; usersCount >= 0; usersCount--) {
      userIds.push(mockUser());
    }

    roundRobinAlgorithm = new RoundRobinAlgorithm();
    DistributionAlgorithms.insert(roundRobinAlgorithm.getDocInitialFields());
  });

  it("should add entry to DistributionAlgorithms collection", () => {
    roundRobinAlgorithm.reconfigure();

    const { userIds: algorithmUserIds } = DistributionAlgorithms.findOne(
      { name: "round-robin" },
      { fields: { userIds: 1 } }
    );

    expect(algorithmUserIds).eqls(userIds);
  });
});

describe("getNextUser() function test", () => {
  let userIds = [];
  let roundRobinAlgorithm;

  beforeEach(() => {
    resetDatabase();

    let usersCount = 2;

    for (; usersCount >= 0; usersCount--) {
      userIds.push(mockUser());
    }

    roundRobinAlgorithm = new RoundRobinAlgorithm();
    DistributionAlgorithms.insert(roundRobinAlgorithm.getDocInitialFields());
  });

  it("should return first user after 1 call", () => {
    const nextUserId = roundRobinAlgorithm.getNextUser();

    const { userIds: algorithmUserIds } = DistributionAlgorithms.findOne(
      { name: roundRobinAlgorithm.getName() },
      { fields: { userIds: 1 } }
    );

    expect(nextUserId).to.be.eq(algorithmUserIds[0]);
  });

  it("should return second user after 2 calls", () => {
    let nextUserId = roundRobinAlgorithm.getNextUser();
    DistributionAlgorithms.update(
      { name: roundRobinAlgorithm.getName() },
      { $set: { lastUsedUser: nextUserId } }
    );

    nextUserId = roundRobinAlgorithm.getNextUser();

    const { userIds: algorithmUserIds } = DistributionAlgorithms.findOne(
      { name: roundRobinAlgorithm.getName() },
      { fields: { userIds: 1 } }
    );

    expect(nextUserId).to.be.eq(algorithmUserIds[1]);
  });

  it("should return first user after a lap of calls", () => {
    let nextUserId;
    userIds.forEach(() => {
      nextUserId = roundRobinAlgorithm.getNextUser();
      DistributionAlgorithms.update(
        { name: roundRobinAlgorithm.getName() },
        { $set: { lastUsedUser: nextUserId } }
      );
    });

    nextUserId = roundRobinAlgorithm.getNextUser();

    const { userIds: algorithmUserIds } = DistributionAlgorithms.findOne(
      { name: roundRobinAlgorithm.getName() },
      { fields: { userIds: 1 } }
    );

    expect(nextUserId).to.be.eq(algorithmUserIds[0]);
  });
});

describe("distribute() function test", () => {
  let userId;
  let chatId;
  let roundRobinAlgorithm;

  beforeEach(() => {
    resetDatabase();

    userId = mockUser();
    chatId = mockChat();
    roundRobinAlgorithm = new RoundRobinAlgorithm();
    DistributionAlgorithms.insert(roundRobinAlgorithm.getDocInitialFields());
    sinon.replace(roundRobinAlgorithm, "getNextUser", () => userId);
  });

  it("should change user in ChatsCollection and DistributionAlgorithms", () => {
    roundRobinAlgorithm.distribute(chatId);

    const chat = ChatsCollection.findOne({ _id: chatId }, { fields: { userId: 1 } });
    const algorithm = DistributionAlgorithms.findOne(
      { name: "round-robin" },
      { fields: { lastUsedUser: 1 } }
    );

    expect(chat.userId).to.be.eq(userId);
    expect(algorithm.lastUsedUser).to.be.eq(userId);
  });

  it("should throw an error if chatId is incorrect", () => {
    chatId = Random.id();

    expect(() => {
      roundRobinAlgorithm.distribute(chatId);
    }).to.throw(Error, `Chat with id ${chatId} not found`);
  });
  afterEach(() => {
    sinon.restore();
  });
});
