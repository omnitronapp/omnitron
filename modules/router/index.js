import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { AuthListener } from "../users/ui/components";
import BaseLayout from "../layouts/components/BaseLayout";

import MainPage from "./mainPage";
import ChatsPage from "../chats/ui/pages/ChatsPage";
import TransportSettingsPage from "../transports/ui/pages/TransportSettingsPage";

import LoginPage from "../users/ui/pages/LoginPage";
import ProfilePage from "../users/ui/pages/ProfilePage";
import UsersPage from "../users/ui/pages/UsersPage";

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
        <Route path="/chats">
          <BaseLayout>
            <ChatsPage />
          </BaseLayout>
        </Route>
        <Route path="/transports">
          <BaseLayout>
            <TransportSettingsPage />
          </BaseLayout>
        </Route>
        <Route path="/users">
          <BaseLayout>
            <UsersPage />
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
