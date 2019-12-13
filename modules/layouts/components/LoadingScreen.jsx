import React from "react";
import { makeStyles } from "@material-ui/core";

import { BarLoader } from "react-spinners";

const useStyles = makeStyles({
  loadingScreen: {
    position: "fixed",
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }
});

export function LoadingScreen() {
  const classes = useStyles();

  return (
    <div className={classes.loadingScreen}>
      <BarLoader height={5} width={150} color="#3696ff" />
    </div>
  );
}
