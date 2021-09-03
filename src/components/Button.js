import React from "react";

export default function Button(props) {
  return (
    <button
      style={props.style}
      disabled={props.disabled}
      onClick={props.onClick}
    >
      {props.name}
    </button>
  );
}
