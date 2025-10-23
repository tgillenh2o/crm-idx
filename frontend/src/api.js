import axios from "axios";

const API_URL = "https://crm-idx-backend.onrender.com/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to set or remove the auth token dynamically
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Define auth methods
export const auth = {
  login: async ({ email, password }) => {
    const response = await api.post('/auth/login', { email, password });
    // Expect response data to contain user and token
    return response.data;
  },
  // You can add other auth methods here (register, logout, etc.)
};

export default api;