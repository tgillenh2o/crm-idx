const API_URL = "https://crm-idx-backend.onrender.com/api"; // replace with your backend URL

export const setAuthToken = (token) => {
  if (token) localStorage.setItem("crm_token", token);
  else localStorage.removeItem("crm_token");
};

// Auth
export const auth = {
  login: async (data) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  register: async (data) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
};

// Teams
export const teams = {
  list: async () => {
    const token = localStorage.getItem("crm_token");
    const res = await fetch(`${API_URL}/teams`, { headers: { Authorization: `Bearer ${token}` } });
    return res.json();
  },
};

// Invites
export const invites = {
  list: async () => {
    const token = localStorage.getItem("crm_token");
    const res = await fetch(`${API_URL}/invites`, { headers: { Authorization: `Bearer ${token}` } });
    return res.json();
  },
};

// Properties
export const properties = {
  list: async () => {
    const token = localStorage.getItem("crm_token");
    const res = await fetch(`${API_URL}/properties`, { headers: { Authorization: `Bearer ${token}` } });
    return res.json();
  },
  sync: async () => {
    const token = localStorage.getItem("crm_token");
    const res = await fetch(`${API_URL}/properties/sync`, { method: "POST", headers: { Authorization: `Bearer ${token}` } });
    return res.json();
  },
};

// Leads
export const leads = {
  list: async () => {
    const token = localStorage.getItem("crm_token");
    const res = await fetch(`${API_URL}/leads`, { headers: { Authorization: `Bearer ${token}` } });
    return res.json();
  },
};
