import React from "react";
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import { LoadingScreen } from "../../../layouts/components/LoadingScreen";

// The root component will render the project pages and components when user is ready
function AuthComponent({ subReady, children }) {
  if (subReady) {
    return children;
  } else {
    return <LoadingScreen />;
  }
}

export default withTracker(() => {
  const sub = Meteor.subscribe("currentUser");

  return {
    subReady: sub.ready(),
    userId: Meteor.userId(),
    user: Meteor.user()
  };
})(AuthComponent);
