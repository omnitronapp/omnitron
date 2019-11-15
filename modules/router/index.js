import React from "react";
import { LoginPage } from "../login/ui/pages/";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { AuthListener } from "../auth/ui/components";
import MainPage from "./mainPage";
import MessagingPage from "../messaging/ui/pages/MessagingPage";

export function AppRouter(props) {
  return (
    <Router>
      <MainPage />
      <Switch>
        <Route path="/messaging">
          <MessagingPage />
        </Route>
        <Route path="/login">
          <LoginPage />
        </Route>
      </Switch>
      <AuthListener />
    </Router>
  );
}
