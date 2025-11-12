import axios from "axios";

// Use your Render backend URL
const BASE_URL = "https://crm-idx.onrender.com/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach JWT token if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // ← matches your login.js
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Log API errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
