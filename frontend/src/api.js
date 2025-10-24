const API_URL = "https://crm-idx.onrender.com/api"; // your Render backend

export const setAuthToken = (token) => {
  if (token) localStorage.setItem("crm_token", token);
  else localStorage.removeItem("crm_token");
};

const getHeaders = () => {
  const token = localStorage.getItem("crm_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const auth = {
  login: async (data) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Login failed");
    return res.json();
  },
  register: async (data) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Registration failed");
    return res.json();
  },
};

export const teams = {
  list: async () => {
    const res = await fetch(`${API_URL}/teams`, { headers: getHeaders() });
    return res.json();
  },
};

// Add other endpoints (invites, properties, leads) similarly
