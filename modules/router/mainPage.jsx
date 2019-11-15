import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";

import React from "react";
import { Redirect } from "react-router-dom";

export default function MainPage(props) {
  const targetPath = Meteor.userId() ? "/messaging" : "/login";

  return (
    <Redirect
      to={{
        pathname: targetPath,
        state: { from: props.location }
      }}
    />
  );
}
