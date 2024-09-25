import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import Loader from './Loader'; // Import the Loader component

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
        const response = await axios.post(
          "http://localhost:8000/account/login/",
          { email, password }
        );
        console.log(response.data);
        const user={
          "email":response.data.email,
          "names":response.data.full_name
        }
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
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="">Email:</label>
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Enter your email"
          />
        </div>
        <div className="form-group">
          <label htmlFor="">Password:</label>
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Enter your password"
          />
        </div>
        <button type="submit">
          Login
          {loading && <Loader />}  
          {/* Render the Loader component when loading is true */}
        </button>
      </form>
    </div>
  );
};

export default Login;





























// ====================Old Code=========================
// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import toast from 'react-hot-toast'

// const Login = () => {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleEmailChange = (e) => {
//     setEmail(e.target.value);
//   };

//   const handlePasswordChange = (e) => {
//     setPassword(e.target.value);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!email || !password) {
//       toast.error("Please fill all the fields");
//       return;
//     } else {
//       try {
//         const response = await axios.post(
//           "http://localhost:8000/account/login/",
//           { email, password }
//         );
//         console.log(response.data);
//         const user={
//           "email":response.data.email,
//           "names":response.data.full_name
//         }
//         if (response.status === 200) {
//           localStorage.setItem("user", JSON.stringify(user));
//           localStorage.setItem("access_token", response.data.access_token);
//           localStorage.setItem("refresh_token", response.data.refresh_token);
//           navigate("/dashboard");
//           toast.success("Logged in successfully!");
//         }
//       } catch (error) {
//         toast.error("Invalid email or password");
//       }
//     }
//   };

//   return (
//     <div>
//       <h1>Login</h1>
//       <form onSubmit={handleSubmit}>
//         <div className="form-group">
//           <label htmlFor="">Email:</label>
//           <input
//             type="email"
//             value={email}
//             onChange={handleEmailChange}
//             placeholder="Enter your email"
//           />
//         </div>
//         <div className="form-group">
//           <label htmlFor="">Password:</label>
//           <input
//             type="password"
//             value={password}
//             onChange={handlePasswordChange}
//             placeholder="Enter your password"
//           />
//         </div>
//         <button type="submit">Login</button>
//       </form>
//     </div>
//   );
// };

// export default Login;

