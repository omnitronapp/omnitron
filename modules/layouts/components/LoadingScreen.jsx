import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import LoadingBar from "./LoadingBar";

const useStyles = makeStyles({
  loadingScreen: {
    position: "fixed",
    width: "100%",
    height: "100%"
  }
});

export function LoadingScreen() {
  const classes = useStyles();

  return (
    <div className={classes.loadingScreen}>
      <LoadingBar />
    </div>
  );
}
