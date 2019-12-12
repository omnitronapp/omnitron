import React from "react";

import { CssBaseline, makeStyles } from "@material-ui/core/";

import { TopAppBar } from "./AppBar";

const useStyles = makeStyles(theme => ({
  root: {
    height: "100vh"
  },
  bufferPlace: {
    height: "64px",
    minWidth: "100%"
  },
  childWrapper: {
    height: "calc(100vh - 64px)"
  }
}));

export default function BaseLayout({ children }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CssBaseline />
      <TopAppBar />
      <div className={classes.bufferPlace} />
      <div className={classes.childWrapper}>{children}</div>
    </div>
  );
}
