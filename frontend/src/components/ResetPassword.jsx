import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosinstance from '../utils/axiosinstance';
import { toast } from 'react-hot-toast';
import './css/ResetPassword.css';
import pic from './img/reset.avif';
const ResetPassword = () => {
  const navigate = useNavigate();
  const { uid, token } = useParams();
  const [new_password, setNewPassword] = useState({
    password: '',
    confirm_password: ''
  });
  const handleChange = (e) => {
    setNewPassword({ ...new_password, [e.target.name]: e.target.value })
  }
  const data = {
    'password': new_password.password,
    'confirm_password': new_password.confirm_password,
    'uidb64': uid,
    'token': token
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(data);
    const response = await axiosinstance.patch("/account/set-new-password/", data);
    if (response.status === 200) {
      toast.success(response.data.message);
      navigate('/login');
    }
  }

  return (
    <div>
      <div className="reset-container">
        <div className="icon">
          <img src={pic} alt="Mail Icon" />
        </div>
        <h2>Reset Password</h2>
        <form id="resetForm" onSubmit={handleSubmit}>
          <div className="input-group">
            <h1>New Password</h1>
            <input
              type="password"
              id="newPassword"
              placeholder="Enter your new password"
              name="password"
              value={new_password.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <h1>Confirm New Password</h1>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Re-Enter your new password"
              name="confirm_password"
              value={new_password.confirm_password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  )
}

export default ResetPassword;