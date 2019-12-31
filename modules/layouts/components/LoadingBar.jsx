import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import BarLoader from "react-spinners/BarLoader";

const useStyles = makeStyles({
  loadingBar: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }
});

export default function LoadingBar({ color = "#3f51b5", height = 5, width = 150 }) {
  const classes = useStyles();

  return (
    <div className={classes.loadingBar}>
      <BarLoader color={color} height={height} width={width} />
    </div>
  );
}
