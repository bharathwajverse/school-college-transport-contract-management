// src/api/axios.js
import axios from 'axios';

// Base URL for API; set via Vite env variable
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true
});

// Request interceptor to attach JWT token from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Response interceptor to handle unauthorized errors (e.g., token expiry)
api.interceptors.response.use((response) => response, (error) => {
  if (error.response && error.response.status === 401) {
    // Remove invalid token and optionally redirect to login page
    localStorage.removeItem('token');
    // Note: navigation will be handled in AuthContext or route guards
  }
  return Promise.reject(error);
});

export default api;
