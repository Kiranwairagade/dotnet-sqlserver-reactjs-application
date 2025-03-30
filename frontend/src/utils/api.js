import axios from 'axios';

// Set up API Base URL
const api = axios.create({
  baseURL: 'http://localhost:5207/api', // Ensure this is the correct backend URL
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // Ensure it's false for CORS issues
});

// Automatically attach token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
