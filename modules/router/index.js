import React from "react";
import { LoginPage } from "../login/ui/pages/";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { AuthListener } from "../auth/ui/components";
import MainPage from "./mainPage";
import MessagingPage from "../messaging/ui/pages/MessagingPage";
import TransportSettingsPage from "../transports/ui/pages/TransportSettingsPage";

export function AppRouter(props) {
  return (
    <Router>
      <Route path="/" exact={true}>
        <MainPage />
      </Route>
      <Switch>
        <Route path="/messaging">
          <MessagingPage />
        </Route>
        <Route path="/transports">
          <TransportSettingsPage />
        </Route>
        <Route path="/login">
          <LoginPage />
        </Route>
      </Switch>
      <AuthListener />
    </Router>
  );
}
