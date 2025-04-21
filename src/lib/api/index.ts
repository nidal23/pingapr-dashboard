// src/lib/api.ts
import axios from 'axios';

// Create axios instance with base URL
export const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Your backend server URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add authentication token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth-storage') 
    ? JSON.parse(localStorage.getItem('auth-storage') || '{}').state?.token
    : null;
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle specific error codes
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      if (error.response.status === 401) {
        // Unauthorized - clear local storage and redirect to login
        localStorage.removeItem('auth-storage');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);