// src/api.js
const API_URL = "https://crm-idx.onrender.com/api"; // ✅ Render backend URL

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

      if (!res.ok) throw new Error(`Login failed: ${res.status}`);
      return await res.json();
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

      if (!res.ok) throw new Error(`Register failed: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error("❌ Register error:", err);
      throw err;
    }
  },
};

// Protected endpoints
const getHeaders = () => {
  const token = localStorage.getItem("crm_token");
  return { Authorization: `Bearer ${token}` };
};

export const teams = {
  list: async () => {
    const res = await fetch(`${API_URL}/teams`, { headers: getHeaders() });
    return res.json();
  },
};

export const invites = {
  list: async () => {
    const res = await fetch(`${API_URL}/invites`, { headers: getHeaders() });
    return res.json();
  },
};

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

export const leads = {
  list: async () => {
    const res = await fetch(`${API_URL}/leads`, { headers: getHeaders() });
    return res.json();
  },
};
