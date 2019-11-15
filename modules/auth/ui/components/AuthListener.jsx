import React from "react";
import { Redirect } from "react-router-dom";

import { withTracker } from "meteor/react-meteor-data";

// The component will listen user state, if he is logged out, then redirect to login page
function AuthListener({ userId, location }) {
  if (userId) {
    return null;
  }

  return (
    <Redirect
      to={{
        pathname: "/login",
        state: { from: location }
      }}
    />
  );
}

export default withTracker(() => {
  const userId = Meteor.userId();

  return {
    userId
  };
})(AuthListener);
