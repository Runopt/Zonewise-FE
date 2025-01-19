import axios from 'axios';

const BASE_URLS = {
  live: 'https://your-production-url.com',
  dev: 'http://localhost:8000',
  test: 'http://localhost:8000',
};

const baseURL =
  process.env.NODE_ENV === 'production' ? BASE_URLS.live : BASE_URLS.dev;

const instance = axios.create({
  baseURL,
});

export const API_ENDPOINTS = {
  SIGNUP: '/api/v1/auth/signup',
  LOGIN: '/api/v1/auth/login',
};

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
