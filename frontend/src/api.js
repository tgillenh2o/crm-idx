const API_URL = "https://crm-idx.onrender.com/api"; // ✅ Your actual backend URL

export const setAuthToken = (token) => {
  if (token) localStorage.setItem("crm_token", token);
  else localStorage.removeItem("crm_token");
};

export const auth = {
  login: async (data) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  register: async (data) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },
};

export const teams = {
  list: async () => {
    const token = localStorage.getItem("crm_token");
    const res = await fetch(`${API_URL}/teams`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  },
};

export const invites = {
  list: async () => {
    const token = localStorage.getItem("crm_token");
    const res = await fetch(`${API_URL}/invites`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  },
};

export const properties = {
  list: async () => {
    const token = localStorage.getItem("crm_token");
    const res = await fetch(`${API_URL}/properties`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  },
  sync: async () => {
    const token = localStorage.getItem("crm_token");
    const res = await fetch(`${API_URL}/properties/sync`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  },
};

export const leads = {
  list: async () => {
    const token = localStorage.getItem("crm_token");
    const res = await fetch(`${API_URL}/leads`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  },
};
