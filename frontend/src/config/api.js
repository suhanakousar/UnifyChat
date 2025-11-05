// API configuration
import axios from 'axios';

const getApiBaseUrl = () => {
  // Priority 1: Use environment variable if provided (most reliable)
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }

  // Priority 2: Check if running in production (not localhost)
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    // If deployed (not localhost), use production backend
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
    return 'https://unifychat-2.onrender.com';
    }
  }

  // Priority 3: Check if running in Replit environment
  if (typeof window !== 'undefined' && window.location.hostname.includes('replit')) {
    return 'http://localhost:3000';
  }

  // Default to localhost for local development
  return 'http://localhost:3000';
};

export const API_BASE_URL = getApiBaseUrl();

// Axios instance with credentials enabled
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Send cookies with requests
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 15000
});

// Add request interceptor to include auth token in all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, clear it and redirect to login
      localStorage.removeItem('authToken');
      localStorage.removeItem('user_id');
      // Redirect to login page
      if (window.location.pathname !== '/Signin') {
        window.location.href = '/Signin';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
