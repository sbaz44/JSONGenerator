import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Analytics from "./pages/Analytics";
import Login from "./pages/Login";

import Service from "./pages/Service";

export default function Routes() {
  return (
    <Router>
      <Switch>
        <Route path="/service" exact>
          <Service />
        </Route>
        <Route exact path="/analytics" component={Analytics} />
        <Route exact path="/" component={Login} />
      </Switch>
    </Router>
  );
}
