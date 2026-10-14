import axios from 'axios';

// Single source of truth for API base URL using environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor to automatically attach JWT token
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

// Response interceptor for consistent error extraction
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Extract readable server error message
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An unexpected error occurred. Please try again.';

    // If unauthorized / token expired, handle appropriately
    if (error.response?.status === 401 && !error.config.url.includes('/auth/login')) {
      console.warn('Session expired or unauthorized request.');
    }

    return Promise.reject(new Error(message));
  }
);

export default api;
