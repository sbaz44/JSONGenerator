import React, { useState } from "react";
import { API_URL } from "../helpers/request";

export default function Signup() {
  const [fullname, setFullname] = useState();
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [email, setEmail] = useState();
  const [phone, setPhone] = useState();
  const [company, setCompany] = useState();
  const handleClick = async () => {
    if (
      fullname === "" ||
      username === "" ||
      password === "" ||
      email === "" ||
      phone === "" ||
      company === ""
    ) {
      alert("Please fill all the details!");
      return;
    }
    let res = await fetch(API_URL + "users/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullName: fullname,
        phone: phone,
        email: email,
        companyName: company,
        userType: ["user"],
        username: username,
        password: password,
      }),
    });
    if (res.status === 200) {
      let jsonData = await res.json();
      console.log(res);
      //   localStorage.setItem("accessToken", jsonData.accessToken);
      //   localStorage.setItem("refreshToken", jsonData.refreshToken);
      //   localStorage.setItem("userType", JSON.stringify(jsonData.userType));
      //   history.push("/service");
    } else {
      alert("Error Occured!");
    }
  };
  return (
    <div id="wrapper">
      <div className="login-container">
        <div className="form">
          <div className="input-group">
            <label htmlFor="email">Full Name</label>
            <input
              value={fullname}
              type="text"
              onChange={(e) => setFullname(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="email">Username</label>
            <input
              value={username}
              type="text"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="email">Password</label>
            <input
              value={password}
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Email</label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="password"
            />
          </div>
          <div className="input-group">
            <label htmlFor="accessKey">Phone</label>
            <input
              onChange={(e) => setPhone(e.target.value)}
              value={phone}
              type="text"
            />
          </div>
          <div className="input-group">
            <label htmlFor="accessKey">Company</label>
            <input
              onChange={(e) => setCompany(e.target.value)}
              value={company}
              type="text"
            />
          </div>
          {/* <div>
            Don't have an account?{" "}
            <Link style={{ color: "blue" }} to="/signup">
              Create One
            </Link>
          </div> */}
          <button onClick={handleClick} className="primary">
            SUBMIT
          </button>
        </div>
      </div>
    </div>
  );
}
