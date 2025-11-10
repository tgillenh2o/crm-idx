import axios from "axios";

// Hardcode your deployed backend URL here
const BASE_URL = "https://crm-idx.onrender.com/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach JWT token if exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("crm_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Global response logging
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
