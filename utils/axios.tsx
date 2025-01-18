import axios from 'axios';

// Define your base URLs
const BASE_URLS = {
  live: '',
  dev: '',
  test: '',
};

const instance = axios.create({
  baseURL:
    process.env.NODE_ENV === 'production' ? BASE_URLS.live : BASE_URLS.dev,
});

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
