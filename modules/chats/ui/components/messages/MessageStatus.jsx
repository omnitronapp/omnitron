import React from "react";

import DoneIcon from "@material-ui/icons/Done";
import DoneAllIcon from "@material-ui/icons/DoneAll";
import ErrorIcon from "@material-ui/icons/Error";

export default function MessageStatus({ status }) {
  if (status === "created") {
    return <DoneIcon />;
  }

  if (status === "sent") {
    return <DoneIcon />;
  }

  if (status === "delivered") {
    return <DoneAllIcon />;
  }

  if (status === "read") {
    return <DoneAllIcon color="primary" />;
  }

  if (status === "error") {
    return <ErrorIcon color="error" />;
  }

  return <DoneIcon color="primary" />;
}
