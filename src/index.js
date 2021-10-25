import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import App2 from "./App2";
import Graphs from "./Graphs";
import Routes from "./Routes";
import "./App.scss";
ReactDOM.render(
  <React.StrictMode>
    <Routes />
    {/* <App2/> */}
  </React.StrictMode>,
  document.getElementById("root")
);
