
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 5000, // 5 second timeout
});

// Interceptor to add JWT token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor for global error logging
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.group('API Error');
    console.error('URL:', error.config?.url);
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
    console.groupEnd();
    return Promise.reject(error);
  }
);

export default API;
