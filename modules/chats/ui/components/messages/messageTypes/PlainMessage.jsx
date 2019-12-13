import React from "react";
import { Typography } from "@material-ui/core";

export default function PlainMessage({ message }) {
  return <Typography>{message.message}</Typography>;
}
