import React, { useState } from "react";
import {
  Box,
  Container,
  Checkbox,
  Paper,
  Tabs,
  Tab,
  TextField,
  Typography,
  FormControlLabel
} from "@material-ui/core";

import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import { TransportsCollection } from "../../collections";
import { LoadingScreen } from "../../../loading/ui/loadingScreen";

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
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      <Container>
        <TextField id="standard-basic" label="Bot API" fullWidth />
        <FormControlLabel control={<Checkbox checked={true} value="enabled" />} label="Enabled" />
      </Container>
    </Typography>
  );
}

function getTransportTabPanels(transports, currentTab) {
  return transports.map((transport, index) => {
    return (
      <TransportTabPanel key={`panel-${transport._id}`} value={currentTab} index={index}>
        {transport.name}
      </TransportTabPanel>
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

  const tabPanels = getTransportTabPanels(transports, currentTab);

  console.log(tabPanels);
  return (
    <Box>
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
    </Box>
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
