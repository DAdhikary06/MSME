import axios from "axios";
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

// Add a request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        // You can add custom headers here, for example, an authorization token
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            
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
