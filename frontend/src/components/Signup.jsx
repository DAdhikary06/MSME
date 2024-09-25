import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast'
import "./css/Signup.css";
import Loader from './Loader';// Import the Material UI Spinner component

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

    google.accounts.id.renderButton(
      document.getElementById("google-btn"),
      {
        theme: "outline",
        size: "large",
        text: "continue_with",
        shape: "circle",
        width: "240px",
      }
    );
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
          toast.success("Account created successfully! Please verify your email");
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
    try {
      const payload = response.credential;
      setLoading(true); // Set loading to true
      const server_res = await axios.post("http://localhost:8000/social/google/", { access_token: payload });
      console.log(server_res);
    } catch (error) {
      toast.error("An error occurred while signing in with Google");
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-form">
        <h2>Create Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="first_name">First Name</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="last_name">Last Name</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              name="password2"
              value={formData.password2}
              onChange={handleInputChange}
            />
          </div>
          <input type="submit" value="Submit" className="submit-button" />
          {loading && <Loader />}
        </form>
        <h3>Or</h3>
        <div className="google-container">
          <button className="googlebutton" id="google-btn" onClick={handleGoogleSignIn}>
            Sign up with Google
          </button>
          
        </div>
      </div>
    </div>
  );
};

export default Signup;















// ====================Old Code=========================
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import toast from 'react-hot-toast'
// import "./css/Signup.css";

// const Signup = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     email: "",
//     first_name: "",
//     last_name: "",
//     password: "",
//     password2: "",
//   });

//   useEffect(() => {
//     /*Global google*/
//     google.accounts.id.initialize({
//       client_id: import.meta.env.VITE_CLIENT_ID,
//       callback: handleGoogleSignIn,
//     });

//     google.accounts.id.renderButton(
//       document.getElementById("google-btn"),
//       {
//         theme: "outline",
//         size: "large",
//         text: "continue_with",
//         shape: "circle",
//         width: "240px",
//       }
//     );
//   }, []);

//   const [error, setError] = useState(null);

//   const handleInputChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };
//   const { email, first_name, last_name, password, password2 } = formData;

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!email || !first_name || !last_name || !password || !password2) {
//       toast.error("Please fill all the fields");
//     } else if (password.length < 6 || password2.length < 6) {
//       toast.error("Password must be at least 6 characters long");
//     } else if (password !== password2) {
//       toast.error("Passwords do not match");
//     } else {
//       try {
//         const response = await axios.post(
//           "http://localhost:8000/account/register/",
//           formData
//         );
//         console.log(response.data);
//         if (response.status === 201) {
//           navigate("/otp/verify");
//           toast.success("Account created successfully! Please verify your email");
//           setError(null); // Clear the error message
//         } else {
//           toast.error("An error occurred while registering");
//         }
//       } catch (error) {
//         if (error.response) {
//           setError(error.response.data.detail);
//         } else {
//           toast.error("An error occurred while registering");
//         }
//       }
//     }
//   };

//   const handleGoogleSignIn = async (response) => {
//     try {
//       const payload = response.credential;
//       const server_res = await axios.post("http://localhost:8000/social/google/", { access_token: payload });
//       console.log(server_res);
//     } catch (error) {
//       toast.error("An error occurred while signing in with Google");
//     }
//   };

//   return (
//     <div className="signup-container">
//       <div className="signup-form">
//         <h2>Create Account</h2>
//         <form onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label htmlFor="email">Email Address</label>
//             <input
//               type="email"
//               id="email"
//               name="email"
//               value={formData.email}
//               onChange={handleInputChange}
//             />
//           </div>
//           <div className="form-group">
//             <label htmlFor="first_name">First Name</label>
//             <input
//               type="text"
//               name="first_name"
//               value={formData.first_name}
//               onChange={handleInputChange}
//             />
//           </div>
//           <div className="form-group">
//             <label htmlFor="last_name">Last Name</label>
//             <input
//               type="text"
//               name="last_name"
//               value={formData.last_name}
//               onChange={handleInputChange}
//             />
//           </div>
//           <div className="form-group">
//             <label htmlFor="password">Password</label>
//             <input
//               type="password"
//               name="password"
//               value={formData.password}
//               onChange={handleInputChange}
//             />
//           </div>
//           <div className="form-group">
//             <label htmlFor="confirmPassword">Confirm Password</label>
//             <input
//               type="password"
//               name="password2"
//               value={formData.password2}
//               onChange={handleInputChange}
//             />
//           </div>
//           <input type="submit" value="Submit" className="submit-button" />
//         </form>
//         <h3>Or</h3>
//         <div className="google-container">
//           <button className="googlebutton" id="google-btn" onClick={handleGoogleSignIn}>
//             Sign up with Google
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Signup;



