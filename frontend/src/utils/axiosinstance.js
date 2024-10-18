// import axios from "axios";
// import { jwtDecode } from "jwt-decode";
// import dayjs from "dayjs";

// // Get tokens from local storage
// const token = localStorage.getItem('access_token');
// const refreshToken = localStorage.getItem('refresh_token');

// // Create an instance of axios
// const axiosInstance = axios.create({
//   baseURL: 'http://localhost:8000', // Replace with your API base URL
//   headers: {
//     'Content-Type': 'application/json',
//     Accept: 'application/json',
//     Authorization: token ? `Bearer ${token}` : '',
//   },
// });

// // Add a request interceptor
// axiosInstance.interceptors.request.use(
//   async (config) => {
//     // Check if token is available
//     if (token) {
//       // Check if token is expired
//       const user = jwtDecode(token);
//       const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;
//       console.log(isExpired);    
//       if (isExpired) {
//         // Refresh token if expired
//         try {
//           const res = await axios.post(`${axiosInstance.defaults.baseURL}/account/token/refresh/`, { refresh: refreshToken });
//           console.log(res.data);
//           if (res.status === 200) {
//             localStorage.setItem('access_token', res.data.access);
//             config.headers.Authorization = `Bearer ${res.data.access}`;
//             return config;
//           } else {
//             // Logout if refresh token is invalid
//             await axios.post(`${axiosInstance.defaults.baseURL}/account/logout/`, { refresh_token: refreshToken });
//             localStorage.removeItem("user");
//             localStorage.removeItem("access_token");
//             localStorage.removeItem("refresh_token");
//             // window.location.href = '/login'; // Redirect to login page
//           }
//         } catch (error) {
//           console.error(error);
//         }
//       }
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// Add a response interceptor
// axiosInstance.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     // Handle errors globally
//     if (error.response && error.response.status === 401) {
//       // Handle unauthorized access
//       // For example, redirect to login page
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;


import axios from "axios";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";

// Get tokens from local storage
const token = localStorage.getItem('access_token');
const refreshToken = localStorage.getItem('refresh_token');

// Create an instance of axios
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000', // Replace with your API base URL
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: token ? `Bearer ${token}` : '',
  },
});

// Function to refresh token
const refreshTokenAsync = async () => {
  try {
    const res = await axios.post(`${axiosInstance.defaults.baseURL}/account/token/refresh/`, { refresh: refreshToken });
    if (res.status === 200) {
      localStorage.setItem('access_token', res.data.access);
      return res.data.access;
    } else {
      throw new Error('Failed to refresh token');
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Add a request interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    // Check if token is available
    if (token) {
      // Check if token is expired
      const user = jwtDecode(token);
      const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;
      if (isExpired) {
        // Refresh token if expired
        try {
          const newToken = await refreshTokenAsync();
          config.headers.Authorization = `Bearer ${newToken}`;
        } catch (error) {
          throw error;
        }
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle errors globally
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access
      // For example, redirect to login page
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;