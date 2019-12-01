import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

import { Link } from "react-router-dom";

const drawerWidth = "25%";

const useStyles = makeStyles(theme => ({
  root: {
    height: "100vh"
  },
  appBar: {
    width: `100%`,
    marginLeft: drawerWidth,
    zIndex: "2020"
  },
  title: {
    flexGrow: 1
  },
  appBarMenuLinks: {
    textDecoration: "none",
    color: "white"
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
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" noWrap className={classes.title}>
            Omnitron
          </Typography>
          <Link to="/messaging" className={classes.appBarMenuLinks}>
            <Button color="inherit">Messages</Button>
          </Link>
          <Link to="/transports" className={classes.appBarMenuLinks}>
            <Button color="inherit">Transports</Button>
          </Link>
        </Toolbar>
      </AppBar>
      <div className={classes.bufferPlace} />
      <div className={classes.childWrapper}>{children}</div>
    </div>
  );
}
