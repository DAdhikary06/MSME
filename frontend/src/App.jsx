import { useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
// import "react-hot-toast/dist/ReactToastify.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  Signup,
  Login,
  Profile,
  VerifyEmail,
  ForgotPassword,
} from "./components";
import "./App.css";

function App() {
  return (
    <>
      <Router>
      <Toaster position="top-center" reverseOrder={true} />
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Profile />} />
          <Route path="/otp/verify" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
