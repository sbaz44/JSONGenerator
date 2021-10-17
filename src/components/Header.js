import React from "react";
import logo from "../logo.png";
import profile from "../profile.jpg";
export default function Header(props) {
  return (
    <header>
      <img src={logo} alt="logo" className="logo" />
      <h3>{props.text}</h3>
      <img src={profile} alt="logo" className="profle" />
    </header>
  );
}
