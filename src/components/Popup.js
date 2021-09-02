import React, { Component } from "react";
class Popup extends Component {
  state = {};
  render() {
    return (
      <div
        className={
          this.props.className
            ? "popupContainer ani-show " + this.props.className
            : "popupContainer ani-show"
        }
      >
        <div className="overlay" onClick={this.props.onClick} />
        {this.props.children}
      </div>
    );
  }
}

export default Popup;
