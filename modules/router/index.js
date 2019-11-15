import React from "react";
import { LoginPage } from "../login/ui/pages/";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { AuthListener } from "../auth/ui/components";
import MainPage from "./mainPage";

export function AppRouter(props) {
  return (
    <Router>
      <MainPage />
      <Switch>
        <Route path="/contacts">
          <h1>HI</h1>
        </Route>
        <Route path="/login">
          <LoginPage />
        </Route>
      </Switch>
      <AuthListener />
    </Router>
  );
}
