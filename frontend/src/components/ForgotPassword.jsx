import React from "react";
import axiosinstance from "../utils/axiosinstance";
import { useState } from "react";
import { toast } from "react-hot-toast";
import "./css/ForgotPassword.css";
import EmailIcon from "./img/Email.jpeg";
const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email) {
      const response = await axiosinstance.post("/account/password-reset/", {
        email: email,
      });
      if (response.status === 200) {
        toast.success(response.data.message);
      }
      console.log(response);
    }setEmail("")
  };
  return (
    <div className="email-container">
      <div className="email-box">
        <div className="icon">
          <img src={EmailIcon} alt="Email Icon" />
        </div>
        <h2>Enter your email address</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            id="email"
            placeholder="Enter your registered email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={handleSubmit}>Send</button>
        </form>
      </div>
    </div>
  );
};
export default ForgotPassword;
