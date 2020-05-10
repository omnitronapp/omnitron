import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import { DistributionAlgorithms } from "../collections";

Meteor.publish("distributionAlgorithms", function() {
  check(this.userId, String);

  return DistributionAlgorithms.find();
});
