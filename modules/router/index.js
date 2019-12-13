import React from "react";
import { LoginPage } from "../login/ui/pages/";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { AuthListener } from "../auth/ui/components";
import MainPage from "./mainPage";
import MessagingPage from "../messaging/ui/pages/MessagingPage";
import TransportSettingsPage from "../transports/ui/pages/TransportSettingsPage";
import BaseLayout from "../layouts/components/BaseLayout";

import ProfilePage from "../user/ui/pages/ProfilePage";

export function AppRouter(props) {
  return (
    <Router>
      <Route path="/" exact={true}>
        <MainPage />
      </Route>
      <Switch>
        <Route path="/profile">
          <BaseLayout>
            <ProfilePage />
          </BaseLayout>
        </Route>
        <Route path="/messaging">
          <BaseLayout>
            <MessagingPage />
          </BaseLayout>
        </Route>
        <Route path="/transports">
          <BaseLayout>
            <TransportSettingsPage />
          </BaseLayout>
        </Route>
        <Route path="/login">
          <LoginPage />
        </Route>
      </Switch>
      <AuthListener />
    </Router>
  );
}
