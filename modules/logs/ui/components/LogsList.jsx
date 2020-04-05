import { Meteor } from "meteor/meteor";

import React from "react";
import { withTracker } from "meteor/react-meteor-data";

import { LogsCollection } from "../../collections";
import { Typography } from "@material-ui/core";

function LogItem({ log }) {
  let color = "textPrimary";

  if (log.type === "warn") {
    color = "textSecondary";
  } else if (log.type === "error") {
    color = "error";
  }

  return (
    <Typography variant="caption" display="block" gutterBottom color={color}>
      {log.text}
    </Typography>
  );
}

function LogsList({ ready, logs }) {
  if (!ready) {
    return "Loading...";
  }

  const logsDom = logs.map(log => {
    return <LogItem key={log._id} log={log} />;
  });

  return (
    <>
      <Typography variant="h6" display="block">
        Logs
      </Typography>
      {logsDom}
    </>
  );
}

export default withTracker(({ filter }) => {
  const handler = Meteor.subscribe("logs", filter);

  return {
    ready: handler.ready(),
    logs: LogsCollection.find(filter, { sort: { createdAt: -1, limit: 50 } }).fetch()
  };
})(LogsList);
