import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { API_URL } from "../helpers/request";
export default function Login() {
  let history = useHistory();

  const [username, setUsername] = useState("dipesh");
  const [password, setPassword] = useState("dipesh@123");

  const handleClick = async () => {
    let res = await fetch(API_URL + "users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        username: username,
        password: password,
      },
    });
    if (res.status === 200) {
      let jsonData = await res.json();
      localStorage.setItem("accessToken", jsonData.accessToken);
      localStorage.setItem("refreshToken", jsonData.refreshToken);
      localStorage.setItem("userType", JSON.stringify(jsonData.userType));
      history.push("/service");
    } else {
      alert("Invalid Username/Password");
    }
  };
  return (
    <div id="wrapper">
      <div className="login-container">
        <img
          src="https://png.pngtree.com/png-vector/20190114/ourlarge/pngtree-abstract-colorful-logo-3d-modern-icon-concept-png-image_313248.jpg"
          className="logo"
          alt="Business view - Reports"
        />
        <div className="form">
          <div className="input-group">
            <label htmlFor="email">Username</label>
            <input
              value={username}
              type="text"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
            />
          </div>
          <button onClick={handleClick} className="primary">
            SUBMIT
          </button>
        </div>
      </div>
    </div>
  );
}