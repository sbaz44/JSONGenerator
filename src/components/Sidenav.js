import React from "react";
import { NavLink } from "react-router-dom";

export default function Sidenav(props) {
  return (
    <div className="sidenav">
      <ul className="links">
        <NavLink activeClassName="activeRoute" to="/service" exact>
          <li>Service Information</li>
        </NavLink>
        <NavLink activeClassName="activeRoute" to="/resource" exact>
          <li>Service Specification</li>
        </NavLink>
        <NavLink activeClassName="activeRoute" to="/dependencies" exact>
          <li>Service Dependencies</li>
        </NavLink>
        <NavLink activeClassName="activeRoute" to="/usecase" exact>
          <li>Service Setting</li>
        </NavLink>
        {/* <NavLink activeClassName="activeRoute" to="/analytics" exact>
          <li>Analytics Setting</li>
        </NavLink> */}
      </ul>
    </div>
  );
}
