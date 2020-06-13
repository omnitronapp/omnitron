import React, { useState } from "react";

import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Checkbox from "@material-ui/core/Checkbox";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";

import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import { TransportsCollection } from "../../collections";
import { LoadingScreen } from "../../../layouts/components/LoadingScreen";
import TransportCredentialsForm from "./TransportCredentialsForm";
import TransportWebhooksInformation from "./TransportWebhooksInformation";
import LogsList from "../../../logs/ui/components/LogsList";

import { PagePermissions } from "../../../users/ui/components/PagePermissions";

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

function TransportTabPanel(props) {
  const { value, index, transport } = props;

  const [credentials, setCredentials] = useState(transport.credentials);
  const [enabled, setEnabled] = useState(transport.enabled);

  function onCredentialChange(event) {
    const { name, value } = event.target;

    setCredentials({
      ...credentials,
      [name]: value
    });
  }

  function onTransportStatusChange(event, newValue) {
    setEnabled(newValue);
  }

  function onSave() {
    Meteor.call(
      "updateTransport",
      {
        transportId: transport._id,
        credentials,
        enabled
      },
      (err, res) => {
        console.log(err, res);
      }
    );
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
        <Typography>
          To properly configure {transport.channel} channel go to:{" "}
          <a href={transport.linkToInstructions} target="_blank">
            {transport.channel} instructions
          </a>
        </Typography>
        <TransportCredentialsForm
          transport={transport}
          credentials={credentials}
          onChange={onCredentialChange}
        />
        <TransportWebhooksInformation webhooks={transport.webhookEndpoints} />
        <FormControlLabel
          control={<Checkbox checked={enabled} value={"Enabled"} />}
          label="Enabled"
          fullWidth
          onChange={onTransportStatusChange}
        />

        <Typography color="error">{transport.errorMessage}</Typography>

        <Typography color={transport.enabled ? "primary" : "error"}>
          Status: {transport.enabled ? "Enabled" : "Disabled"}
        </Typography>

        <div>
          <Button color="primary" onClick={onSave} variant="contained">
            Save
          </Button>
        </div>

        <LogsList filter={{ event: "transport", transport: transport.name }} />
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

const PageWithPermissions = PagePermissions(TransportSettingsPage, "READ_TRANSPORTS");

export default withTracker(() => {
  const subHandler = Meteor.subscribe("transports");

  const transports = TransportsCollection.find().fetch();
  return {
    ready: subHandler.ready(),
    transports
  };
})(PageWithPermissions);
