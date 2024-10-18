import React, { useState } from "react";
// import axiosInstance from "../utils/axiosinstance";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "./Loader"; // Import the Loader component
import axios from "axios";
import "./css/Verify-Email.css";
import Verify from "./img/Verify.png"

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false); // Add a loading state

  const handleInputChange = (e) => {
    setOtp(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when submitting the form
    try {
      if (otp) {
        const response = await axios.post("http://localhost:8000/account/verify-email/", {
          otp,
        });
        if (response.status === 200) {
          navigate("/login");
          toast.success(response.data.message);
        }
      } else if (otp == "" || otp == null) {
        toast.error("Please enter your OTP code");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false); // Set loading to false when the request is complete
    }
  };

  return (
    <>
    <div className="verify-container">
      <form onSubmit={handleSubmit}>
        <div className="verification-box">
          <div className="icon">
            <img src={Verify} alt="Lock Icon" />
          </div>
          <h2>Verify Email</h2>
          <p>Please verify your email</p>
          <input type="text" id="otp" placeholder="Enter your OTP" value={otp} onChange={handleInputChange} />
          <button>Validate OTP</button> 
          {loading && <Loader key={loading} />} 
        </div>
      </form>
    </div>
  </>
  );
};

export default VerifyEmail;

