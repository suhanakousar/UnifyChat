// API configuration
const getApiBaseUrl = () => {
  // Check if running in production
  if (import.meta.env.MODE === 'production') {
    return 'https://unifychat-2.onrender.com';
  }

  // Check if running in Replit environment
  if (typeof window !== 'undefined' && window.location.hostname.includes('replit')) {
    // Use same origin for Replit (backend on port 3000, but accessed through proxy)
    return 'http://localhost:3000';
  }

  // Use environment variable if provided
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }

  // Default to localhost for local development
  return 'http://localhost:3000';
};

export const API_BASE_URL = getApiBaseUrl();
