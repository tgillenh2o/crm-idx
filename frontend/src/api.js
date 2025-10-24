// src/api.js
const API_URL = "https://crm-idx.onrender.com/api"; // Render backend URL

// Save/remove token
export const setAuthToken = (token) => {
  if (token) localStorage.setItem("crm_token", token);
  else localStorage.removeItem("crm_token");
};

// Auth endpoints
export const auth = {
  login: async (data) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        // Show backend error message in frontend
        throw new Error(json.message || `Login failed with status ${res.status}`);
      }

      return json;
    } catch (err) {
      console.error("❌ Login error:", err);
      throw err;
    }
  },

  register: async (data) => {
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || `Register failed with status ${res.status}`);
      }

      return json;
    } catch (err) {
      console.error("❌ Register error:", err);
      throw err;
    }
  },
};

// Helper for protected endpoints
const getHeaders = () => {
  const token = localStorage.getItem("crm_token");
  return { Authorization: `Bearer ${token}` };
};

// Teams API
export const teams = {
  list: async () => {
    const res = await fetch(`${API_URL}/teams`, { headers: getHeaders() });
    return res.json();
  },
};

// Invites API
export const invites = {
  list: async () => {
    const res = await fetch(`${API_URL}/invites`, { headers: getHeaders() });
    return res.json();
  },
};

// Properties API
export const properties = {
  list: async () => {
    const res = await fetch(`${API_URL}/properties`, { headers: getHeaders() });
    return res.json();
  },
  sync: async () => {
    const res = await fetch(`${API_URL}/properties/sync`, {
      method: "POST",
      headers: getHeaders(),
    });
    return res.json();
  },
};

// Leads API
export const leads = {
  list: async () => {
    const res = await fetch(`${API_URL}/leads`, { headers: getHeaders() });
    return res.json();
  },
};
