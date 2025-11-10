import axios from "axios";

// Create a central axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api", 
  withCredentials: true, // send cookies if using sessions
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Add a request interceptor to attach auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("crm_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: Add a response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
