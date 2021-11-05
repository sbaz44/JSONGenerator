import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { API_URL } from "../helpers/request";
export default function Login() {
  let history = useHistory();

  const [username, setUsername] = useState("diycam");
  const [password, setPassword] = useState("admin@123");
  const [accessKey, setAccessKey] = useState(
    "7abb86814c7ed37a00004e2aa20237794cf17c6e"
  );

  const handleClick = async () => {
    let res = await fetch(API_URL + "users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        username: username,
        password: password,
        accessKey: accessKey,
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
          <div className="input-group">
            <label htmlFor="accessKey">Access Key</label>
            <input
              onChange={(e) => setAccessKey(e.target.value)}
              value={accessKey}
              type="text"
            />
          </div>
          <div>
            Don't have an account?{" "}
            <Link style={{ color: "blue" }} to="/signup">
              Create One
            </Link>
          </div>
          <button onClick={handleClick} className="primary">
            SUBMIT
          </button>
        </div>
      </div>
    </div>
  );
}
