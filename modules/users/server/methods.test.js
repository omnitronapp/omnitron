import { resetDatabase } from "meteor/xolvio:cleaner";
import { Random } from "meteor/random";
import { Meteor } from "meteor/meteor";

import sinon from "sinon";

import { mockUserWithRole, mockUser } from "../../../server/testData";
import { initializeRoles } from "./roles";
import "./methods";
import { expect } from "chai";

describe("updateUserCredentials() method test", () => {
  let masterUserId;

  beforeEach(() => {
    resetDatabase();
    initializeRoles();

    masterUserId = mockUserWithRole("CHANGE_USERS");
    sinon.replace(Meteor, "user", () =>
      Meteor.users.findOne({ _id: masterUserId }, { fields: { username: 1 } })
    );
    sinon.replace(Meteor, "userId", () => masterUserId);
  });

  it("should set username & password", () => {
    const { updateUserCredentials } = Meteor.server.method_handlers;

    const credentials = { username: Random.id(), password: Random.id() };
    const invocation = { userId: masterUserId };

    updateUserCredentials.call(invocation, credentials);

    const user = Meteor.users.findOne({ _id: masterUserId });
    const checkPassword = Accounts._checkPassword(user, credentials.password);

    expect(masterUserId).to.be.eq(checkPassword.userId);
    expect(checkPassword.error).to.be.undefined;
  });

  it("should throw an error if user doesn't have permission", () => {
    masterUserId = mockUser();

    const { updateUserCredentials } = Meteor.server.method_handlers;

    const credentials = { username: Random.id(), password: Random.id() };
    const invocation = { userId: masterUserId };

    expect(() => {
      updateUserCredentials.call(invocation, credentials);
    }).to.throw(Error, "User doesn't have permission CHANGE_USERS");
  });

  afterEach(() => {
    sinon.restore();
  });
});

describe("removeUser() method test", () => {
  let masterUserId;
  let agentUserId;

  beforeEach(() => {
    resetDatabase();
    initializeRoles();

    masterUserId = mockUserWithRole("REMOVE_USERS");
    agentUserId = mockUser();
  });

  it("should remove user", () => {
    const { removeUser } = Meteor.server.method_handlers;
    const invocation = { userId: masterUserId };

    removeUser.call(invocation, agentUserId);

    const { active } = Meteor.users.findOne({ _id: agentUserId }, { fields: { active: 1 } });

    expect(active).to.be.false;
  });

  it("should throw an error if user doesn't have permission", () => {
    const { removeUser } = Meteor.server.method_handlers;
    const invocation = { userId: agentUserId };

    expect(() => {
      removeUser.call(invocation, masterUserId);
    }).to.throw(Error, "User doesn't have permission REMOVE_USERS");
  });

  it("should throw an error if userId isn't correct", () => {
    const { removeUser } = Meteor.server.method_handlers;
    const invocation = { userId: masterUserId };
    agentUserId = Random.id();

    expect(() => {
      removeUser.call(invocation, agentUserId);
    }).to.throw(Error, `User with id ${agentUserId} doesn't exist`);
  });
});

describe("editUser() method test", () => {
  let masterUserId;

  beforeEach(() => {
    resetDatabase();
    initializeRoles();
    masterUserId = mockUserWithRole("CHANGE_USERS");
  });

  it("should change username and password", () => {
    const userProps = {
      permissions: ["admin"],
      user: {
        username: Random.id(),
        password: Random.id()
      }
    };
    const useridToEdit = mockUser();
    const invocation = { userId: masterUserId };
    const { editUser } = Meteor.server.method_handlers;

    editUser.call(invocation, useridToEdit, userProps);

    const user = Meteor.users.findOne({ _id: useridToEdit });
    const checkPassword = Accounts._checkPassword(user, userProps.user.password);

    expect(user.username).to.be.eq(userProps.user.username);
    expect(checkPassword.error).to.be.undefined;
    expect(Roles.userIsInRole(useridToEdit, "admin")).to.be.true;
  });

  it("should throw an error if user doesn't have permission", () => {
    masterUserId = mockUser();

    const userProps = {
      permissions: ["admin"],
      user: {
        username: Random.id(),
        password: Random.id()
      }
    };
    const useridToEdit = mockUser();
    const invocation = { userId: masterUserId };
    const { editUser } = Meteor.server.method_handlers;

    expect(() => {
      editUser.call(invocation, useridToEdit, userProps);
    }).to.throw(Error, "User doesn't have permission CHANGE_USERS");
  });
});

describe("addUser() method test", () => {
  let masterUserId;

  beforeEach(() => {
    resetDatabase();
    initializeRoles();
    masterUserId = mockUserWithRole("ADD_USERS");
  });

  it("should add user", () => {
    const { addUser } = Meteor.server.method_handlers;
    const invocation = { userId: masterUserId };
    const userProps = {
      permissions: ["admin"],
      user: {
        username: Random.id(),
        password: Random.id()
      }
    };

    const userId = addUser.call(invocation, userProps);
    const user = Meteor.users.findOne({ _id: userId });

    const checkPassword = Accounts._checkPassword(user, userProps.user.password);

    expect(user.username).to.be.eq(userProps.user.username);
    expect(checkPassword.error).to.be.undefined;
    expect(Roles.userIsInRole(userId, "admin")).to.be.true;
  });

  it("should throw an error if user doesn't have permission", () => {
    masterUserId = mockUser();

    const { addUser } = Meteor.server.method_handlers;
    const invocation = { userId: masterUserId };
    const userProps = {
      permissions: ["admin"],
      user: {
        username: Random.id(),
        password: Random.id()
      }
    };
    expect(() => {
      addUser.call(invocation, userProps);
    }).to.throw(Error, "User doesn't have permission ADD_USERS");
  });
});

describe("getUserRoles() method test", () => {
  let masterUserId;

  beforeEach(() => {
    resetDatabase();
    initializeRoles();

    masterUserId = mockUserWithRole("CHANGE_USERS");
  });

  it("should give roles", () => {
    const invocation = { userId: masterUserId };
    const { getUserRoles } = Meteor.server.method_handlers;

    const roles = getUserRoles.call(invocation, masterUserId);

    expect(roles).to.be.eql(["CHANGE_USERS"]);
  });

  it("should throw an error if user doesn't have permission", () => {
    masterUserId = mockUser();
    const agentUserId = mockUser();
    const invocation = { userId: masterUserId };
    const { getUserRoles } = Meteor.server.method_handlers;

    expect(() => {
      getUserRoles.call(invocation, agentUserId);
    }).to.throw(Error, "User doesn't have permission CHANGE_USERS");
  });
});

describe("setRole() method test", () => {
  let userId;

  beforeEach(() => {
    resetDatabase();
    initializeRoles();

    userId = mockUser();
  });

  it("should set role to user", () => {
    const { setRole } = Meteor.server.method_handlers;

    setRole(userId, "admin");

    expect(Roles.userIsInRole(userId, "admin")).to.be.true;
  });
});

describe("createNewRole() method test", () => {
  let userId;

  beforeEach(() => {
    resetDatabase();
    initializeRoles();

    userId = mockUser();
  });

  it("should create new role", () => {
    const { createNewRole } = Meteor.server.method_handlers;
    const childRoles = ["ADD_USERS", "LIST_USERS", "CHANGE_USERS", "REMOVE_USERS"];

    createNewRole("manager", childRoles);

    Roles.addUsersToRoles(userId, "manager");
    childRoles.forEach(role => {
      expect(Roles.userIsInRole(userId, role)).to.be.true;
    });
  });
});
