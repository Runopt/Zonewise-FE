import axios from 'axios';

// Define your base URLs
const BASE_URLS = {
  live: 'https://your-production-url.com',
  dev: 'http://localhost:8000',
  test: 'http://localhost:8000', // Adjust as needed
};

// Determine the base URL based on the environment
const baseURL = process.env.NODE_ENV === 'production' ? BASE_URLS.live : BASE_URLS.dev;

// Create an axios instance
const instance = axios.create({
  baseURL,
});

// Define API endpoints
export const API_ENDPOINTS = {
  SIGNUP: '/api/v1/auth/signup',
  LOGIN: '/api/v1/auth/login',
  // Add other endpoints here
};

// Request interceptor to add authorization token
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor to handle errors
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error('Unauthorized request');
    }
    return Promise.reject(error);
  },
);

export default instance;
