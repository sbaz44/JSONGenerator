import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Analytics from "./pages/Analytics";
import Resource from "./pages/Resource";
import Login from "./pages/Login";

import Service from "./pages/Service";
import Dependencies from "./pages/Dependencies";
import Graphs from "./Graphs";
import Usecase from "./pages/Usecase";

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
        <Route exact path="/graphs" component={Graphs} />
        <Route exact path="/usecase" component={Usecase} />
      </Switch>
    </Router>
  );
}
