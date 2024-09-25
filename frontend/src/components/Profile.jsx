import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast'
import axiosInstance from "../utils/axiosinstance";
import { useEffect } from "react";
const Profile = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const jwt_access = localStorage.getItem("access_token");
  const refresh_token = localStorage.getItem("refresh_token");

  useEffect(() => {
    if (!jwt_access) {
      navigate("/login");
    } else {
      getSomeData();
    } 
  }, [jwt_access, user]);





  const handleLogout = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${jwt_access}`,
      },
    };

    const data = {
      refresh_token: refresh_token,
    };
    const response = await axiosInstance.post("/account/logout/", data, config);

    if (response.status === 200) {
      localStorage.removeItem("user");
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      navigate("/login");
      toast.success("Logged out successfully!");
    }
  };
  const getSomeData = async () => {
    const response = await axiosInstance.get("/account/test-auth/");
    if (response.status === 200) {
      console.log(response.data);
    }
};

  return (
    <div>
      <h2>Hi, {user && user.names}</h2>
      <p style={{ color: "green" }}>Welcome to StocksSaver Page</p>
      <button onClick={handleLogout} className="logout-btn">
        Logout
      </button>
    </div>
  );
};

export default Profile;
