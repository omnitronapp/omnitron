import { resetDatabase } from "meteor/xolvio:cleaner";
import { mockUser } from "../../../server/testData";
import { initializeRoles } from "./roles";
import { expect } from "chai";

describe("initializeRoles() method test", () => {
  beforeEach(() => {
    resetDatabase();
  });

  it("should give admin to the all users", () => {
    let userIds = [];
    var usersCount = 3;
    for (; usersCount >= 0; usersCount--) {
      userIds.push(mockUser());
    }

    initializeRoles();

    userIds.forEach(userId => {
      expect(Roles.userIsInRole(userId, "admin")).to.be.true;
    });
  });
});
