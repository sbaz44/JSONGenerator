import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Analytics from "./pages/Analytics";
import Resource from "./pages/Resource";
import Login from "./pages/Login";

import Service from "./pages/Service";
import Dependencies from "./pages/Dependencies";

export default function Routes() {
  return (
    <Router>
      <Switch>
        <Route path="/service" exact>
          <Service />
        </Route>
        <Route exact path="/analytics" component={Analytics} />
        <Route exact path="/" component={Login} />
        <Route exact path="/resource" component={Resource} />
        <Route exact path="/dependencies" component={Dependencies} />
      </Switch>
    </Router>
  );
}
