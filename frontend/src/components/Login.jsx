import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "./Loader"; // Import the Loader component
import "./css/Login.css";
import LoginInventory from "./img/Login.png";


const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // Add a loading state

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when submitting the form
    if (!email || !password) {
      toast.error("Please fill all the fields");
      setLoading(false); // Set loading to false if fields are empty
      return;
    } else {
      try {
        const response = await axios.post("http://localhost:8000/account/login/", {
          email,
          password,
        });
        console.log(response.data);
        const user = {
          email: response.data.email,
          names: response.data.full_name,
        };
        if (response.status === 200) {
          localStorage.setItem("user", JSON.stringify(user));
          localStorage.setItem("access_token", response.data.access_token);
          localStorage.setItem("refresh_token", response.data.refresh_token);
          navigate("/dashboard");
          toast.success("Logged in successfully!");
        }
      } catch (error) {
        toast.error("Invalid email or password");
      } finally {
        setLoading(false); // Set loading to false when the request is complete
      }
    }
  };

  return (
    <div className="login-container">
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <i className='bx bx-plus-medical'></i>
          <h1>Welcome to StocksSaver</h1>
          <p>Medical Inventory Management System </p>
          
          <div className="input-group">
            <h4>Email*</h4>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={handleEmailChange}
              required
            />
            <i className='bx bxl-gmail'></i>
          </div>
          <div className="input-group">
            <h4>Password*</h4>
            <input
              type="password"
              id="confirmPassword"
              placeholder="minimum 6 characters"
              value={password}
              onChange={handlePasswordChange}
              required
            />
            <i className='bx bxs-lock-alt' ></i>
          </div>
          <div className="remember-forgot">
            <label>
              <input type="checkbox" />
              Remember Me
            </label>
            <Link to={'/forgot-password'}>Forgot password?</Link>

          </div>
          <button type="submit" className="button"> 
            {loading ? <Loader /> : 'Login'} 
          </button>
          <div className="register-link">
            <p>Not registered yet? <Link to={'/'}>Register</Link></p>
          </div>
        </form>
      </div>
      <div className="img-container">
        <img src={LoginInventory} alt="Inventory Image" />
      </div>
    </div>
  );
};

export default Login;