const API_URL = "https://crm-idx.onrender.com/api"; // your deployed backend URL

// Store or remove token
export const setAuthToken = (token) => {
  if (token) localStorage.setItem("crm_token", token);
  else localStorage.removeItem("crm_token");
};

// Build headers with optional auth token
const getHeaders = () => {
  const token = localStorage.getItem("crm_token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// ---------- Auth ----------
export const auth = {
  login: async (data) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Login failed");
      }
      return res.json();
    } catch (err) {
      console.error("Login error:", err);
      throw err;
    }
  },

  register: async (data) => {
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Registration failed");
      }
      return res.json();
    } catch (err) {
      console.error("Registration error:", err);
      throw err;
    }
  },
};

// ---------- Teams ----------
export const teams = {
  list: async () => {
    try {
      const res = await fetch(`${API_URL}/teams`, { headers: getHeaders() });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to fetch teams");
      }
      return res.json();
    } catch (err) {
      console.error("Teams fetch error:", err);
      throw err;
    }
  },
  create: async (
