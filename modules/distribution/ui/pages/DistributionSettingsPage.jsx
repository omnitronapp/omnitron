import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";

import React from "react";

import { DistributionAlgorithms } from "../../collections";
import LoadingBar from "../../../layouts/components/LoadingBar";

import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import List from "@material-ui/core/List";

const useStyles = makeStyles({
  paper: {
    // padding: "32px",
    // paddingTop: "16px"
  }
});

function DistributionSettingsPage({ ready, distributionAlgorithms }) {
  const classes = useStyles();

  if (!ready) {
    return <LoadingBar />;
  }

  const roundRobin = distributionAlgorithms[0];

  const usersList = roundRobin.usernames.map((username, index) => {
    return (
      <ListItem>
        <ListItemText primary={`${index + 1}. ${username}`} />
      </ListItem>
    );
  });
  return (
    <Container>
      <Paper className={classes.paper}>
        <Tabs value={0} aria-label="Distribution algorithms tabs">
          <Tab key="header-round-robin" label="Round Robin" />
        </Tabs>

        <Typography
          component="div"
          role="tabpanel"
          id={`simple-tabpanel-1`}
          aria-labelledby={`simple-tab-1`}
        >
          <Container>
            In Round-robin each chat is distributed turn by turn only in a cyclic queue to the
            following list of users
            <List component="nav" className={classes.root} aria-label="users list">
              {usersList}
            </List>
          </Container>
        </Typography>
      </Paper>
    </Container>
  );
}

export default withTracker(() => {
  const subHandler = Meteor.subscribe("distributionAlgorithms");
  const distributionAlgorithms = DistributionAlgorithms.find().fetch();

  return {
    ready: subHandler.ready(),
    distributionAlgorithms
  };
})(DistributionSettingsPage);
