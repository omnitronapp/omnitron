import React, { useState } from "react";

import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Checkbox from "@material-ui/core/Checkbox";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";

import { makeStyles } from "@material-ui/core/styles";

import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import { TransportsCollection } from "../../collections";
import { LoadingScreen } from "../../../layouts/components/LoadingScreen";
import TransportCredentialsForm from "./TransportCredentialsForm";
import TransportWebhooksInformation from "./TransportWebhooksInformation";
import red from "@material-ui/core/colors/red";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`
  };
}

function getTransportTabs(transports) {
  return transports.map((transport, index) => {
    return <Tab key={`header-${transport._id}`} label={transport.name} {...a11yProps(index)} />;
  });
}

const style = makeStyles({
  errorMessage: {
    color: red[400]
  }
});

function TransportTabPanel(props) {
  const classes = style();

  const { value, index, transport } = props;

  function onCredentialChange(event, asd) {
    const { name, value } = event.target;

    Meteor.call("updateTransportCredential", transport._id, name, value, (err, res) => {
      console.log(err, res);
    });
  }

  function onTransportStatusChange(event, enabled) {
    Meteor.call("changeTransportStatus", transport._id, enabled, (err, res) => {
      console.log(err, res);
    });
  }

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      <Container>
        <TransportCredentialsForm
          transport={transport}
          credentials={transport.credentials}
          onChange={onCredentialChange}
        />
        <TransportWebhooksInformation webhooks={transport.webhookEndpoints} />
        <FormControlLabel
          control={<Checkbox checked={transport.enabled} value={"Enabled"} />}
          label="Enabled"
          onChange={onTransportStatusChange}
        />
        <p className={classes.errorMessage}>{transport.errorMessage}</p>
        <p>
          To properly configure {transport.channel} channel go to:{" "}
          <a href={transport.linkToInstructions} target="_blank">
            {transport.channel} instructions
          </a>
        </p>
      </Container>
    </Typography>
  );
}

function getTransportTabPanels(transports, currentTab) {
  return transports.map((transport, index) => {
    return (
      <TransportTabPanel
        key={`panel-${transport._id}`}
        value={currentTab}
        index={index}
        transport={transport}
      />
    );
  });
}

function TransportSettingsPage({ ready, transports }) {
  if (!ready) {
    return <LoadingScreen />;
  }

  const [currentTab, setCurrentTab] = useState(0);

  function handleChange(event, newTabIndex) {
    setCurrentTab(newTabIndex);
  }

  return (
    <Container>
      <Grid>
        <Grid item xs={12}>
          <Paper>
            <Tabs
              value={currentTab}
              onChange={handleChange}
              aria-label="Channel transports configuration"
            >
              {getTransportTabs(transports)}
            </Tabs>

            {getTransportTabPanels(transports, currentTab)}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default withTracker(() => {
  const subHandler = Meteor.subscribe("transports");

  const transports = TransportsCollection.find().fetch();
  return {
    ready: subHandler.ready(),
    transports
  };
})(TransportSettingsPage);
