import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Analytics from "./pages/Analytics";
import Resource from "./pages/Resource";
import Login from "./pages/Login";

import Service from "./pages/Service";
import Dependencies from "./pages/Dependencies";
import Graphs from "./Graphs";
import Usecase from "./pages/Usecase";
import Usecase2 from "./pages/Usecase2";
import DynamicForm from "./pages/DynamicForm";
import Signup from "./pages/Signup";
import ROI from "./pages/ROI";
import Canvas from "./pages/Canvas";
import VMS from "./pages/VMS";
import VMSPlayer from "./pages/VMSPlayer";
import Charts from "./pages/Charts";
import Table from "./pages/Table";
import Canvas2 from "./pages/Canvas2";
import Magnify from "./pages/Magnify";

export default function Routes() {
  return (
    <Router>
      <Switch>
        <Route path="/service" exact>
          <Service />
        </Route>
        <Route exact path="/analytics" component={Analytics} />
        <Route exact path="/" component={Login} />
        <Route exact path="/signup" component={Signup} />
        <Route exact path="/resource" component={Resource} />
        <Route exact path="/dependencies" component={Dependencies} />
        <Route exact path="/graphs" component={Graphs} />
        <Route exact path="/usecase" component={Usecase} />
        <Route exact path="/usecase2" component={Usecase2} />
        <Route exact path="/dynamic" component={DynamicForm} />
        <Route exact path="/roi" component={ROI} />
        <Route exact path="/canvas" component={Canvas} />
        <Route exact path="/canvas2" component={Canvas2} />
        <Route exact path="/vms" component={VMS} />
        <Route exact path="/player" component={VMSPlayer} />
        <Route exact path="/chart" component={Charts} />
        <Route exact path="/table" component={Table} />
        <Route exact path="/magnify" component={Magnify} />
      </Switch>
    </Router>
  );
}
