import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import Loader from './Loader'; // Import the Loader component

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
        const response = await axios.post(
          "http://localhost:8000/account/verify-email/",
          { otp }
        );
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
    <div>
      <div className="form-container">
        <h1>Verify Email</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="">Enter your OTP code:</label>
            <input
              type="text"
              className="email-from"
              value={otp}
              onChange={handleInputChange}
            />
          </div>
          <button type="submit" className="vbtn">
            Verify Email
            {loading && <Loader />} 
            {/* Render the Loader component when loading is true */}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyEmail;




































// ====================Old Code=========================
// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import toast from 'react-hot-toast'

// const VerifyEmail = () => {
//   const navigate = useNavigate();
//   const [otp, setOtp] = useState("");

//   const handleInputChange = (e) => {
//     setOtp(e.target.value);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (otp) {
//         const response = await axios.post(
//           "http://localhost:8000/account/verify-email/",
//           { otp }
//         );
//         if (response.status === 200) {
//           navigate("/login");
//           toast.success(response.data.message);
//         }
//       } else if (otp == "" || otp == null) {
//         toast.error("Please enter your OTP code");
//       }
//     } catch (error) {
//       toast.error(error.response.data.message);
//     }
//   };

//   return (
//     <div>
//       <div className="form-container">
//         <h1>Verify Email</h1>
//         <form onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label htmlFor="">Enter your OTP code:</label>
//             <input
//               type="text"
//               className="email-from"
//               value={otp}
//               onChange={handleInputChange}
//             />
//           </div>
//           <button type="submit" className="vbtn">
//             Verify Email
            
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default VerifyEmail;


