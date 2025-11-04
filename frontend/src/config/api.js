// API configuration
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
