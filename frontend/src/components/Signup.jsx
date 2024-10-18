import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "./css/Signup.css";
import Loader from "./Loader"; // Import the Material UI Spinner component
import SignImg from "./img/SignImg.webp";


const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    password2: "",
  });

  useEffect(() => {
    /*Global google*/
    google.accounts.id.initialize({
      client_id: import.meta.env.VITE_CLIENT_ID,
      callback: handleGoogleSignIn,
    });

    google.accounts.id.renderButton(document.getElementById("google-btn"), {
      theme: "outline",
      size: "large",
      text: "continue_with",
      shape: "circle",
      width: "240px",
    });
  }, []);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Add a loading state

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const { email, first_name, last_name, password, password2 } = formData;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !first_name || !last_name || !password || !password2) {
      toast.error("Please fill all the fields");
    } else if (password.length < 6 || password2.length < 6) {
      toast.error("Password must be at least 6 characters long");
    } else if (password !== password2) {
      toast.error("Passwords do not match");
    } else {
      setLoading(true); // Set loading to true
      try {
        const response = await axios.post(
          "http://localhost:8000/account/register/",
          formData
        );
        console.log(response.data);
        if (response.status === 201) {
          navigate("/otp/verify");
          toast.success(
            "Account created successfully! Please verify your email"
          );
          setError(null); // Clear the error message
        } else {
          toast.error("An error occurred while registering");
        }
      } catch (error) {
        if (error.response) {
          setError(error.response.data.detail);
        } else {
          toast.error("An error occurred while registering");
        }
      } finally {
        setLoading(false); // Set loading to false
      }
    }
  };


  const handleGoogleSignIn = async (response) => {
    const payload = response.credential;
    setLoading(true); // Set loading to true
    try {
      const tokenInfoResponse = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${payload}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Token info:', tokenInfoResponse.data);
      if (tokenInfoResponse.data.error) {
        throw new Error(tokenInfoResponse.data.error);
      }
      const serverResponse = await axios.post("http://localhost:8000/account/google/", {
        access_token: payload,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true, // Add this option to enable CORS
      });
      console.log('Server response:', serverResponse.data);
      if (serverResponse.status === 200) {
        navigate("/dashboard");
        toast.success("Signed in successfully!");
      } else {
        throw new Error('Invalid server response');
      }
    } catch (error) {
      console.error('Error signing in with Google:', error);
      toast.error("An error occurred while signing in with Google");
    } finally {
      setLoading(false); // Set loading to false
    }
  };
  
  return (

    <div className="container">
      <div className="form-left">
        <img src={SignImg} alt="Sign Up" />
      </div>
      <div className="form-right">
        <h2>Register</h2>
        <p>Manage all your inventory efficiently</p>
        <small>
          Let's get you all set up so you can verify your personal account and
          begin setting up your work profile.
        </small>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="first_name"
              placeholder="Enter Your First Name"
              value={formData.first_name}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="last_name"
              placeholder="Enter Your Last Name"
              value={formData.last_name}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter Your Email"
              value={formData.email}
              onChange={handleInputChange}
              autoComplete="on"
            />
          </div>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter Your Password"
            value={formData.password}
            onChange={handleInputChange}
            autoComplete="on"
          />
          <div className="form-group">
            <input
              type="password"
              id="password2"
              name="password2"
              placeholder="Confirm Password"
              value={formData.password2}
              onChange={handleInputChange}
              autoComplete="on"
            />
          </div>
          <div className="terms">
            <input type="checkbox" id="terms" name="terms" value="terms" />
            <label htmlFor="terms">
              I agree to all terms, privacy policies, and fees
            </label>
          </div>
          <button type="submit" id="signupBtn">
            Sign Up
          </button>
          {loading && <Loader />}
          <p className="login">
            Already have an account? <a href="/login">Log in</a>
          </p>
        </form>

        <h3>Or</h3>
          <div className="google-container">
           <button
             className="googlebutton"
             id="google-btn"
             onClick={handleGoogleSignIn}
           >
             Sign up with Google
           </button>
       </div>

      </div>
    </div>
  );
};

export default Signup;
