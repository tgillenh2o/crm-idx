const API_URL = "https://crm-idx.onrender.com/api"; // ✅ Render backend URL

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
    if (!res.ok) throw new Error(`Login failed: ${res.status}`);
    return res.json();
  },
  register: async (data) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Register failed: ${res.status}`);
    return res.json();
  },
};

export const teams = {
  list: async () => fetch(`${API_URL}/teams`, { headers: getHeaders() }).then(r => r.json()),
};

export const invites = {
  list: async () => fetch(`${API_URL}/invites`, { headers: getHeaders() }).then(r => r.json()),
};

export const properties = {
  list: async () => fetch(`${API_URL}/properties`, { headers: getHeaders() }).then(r => r.json()),
  sync: async () => fetch(`${API_URL}/properties/sync`, { method: "POST", headers: getHeaders() }).then(r => r.json()),
};

export const leads = {
  list: async () => fetch(`${API_URL}/leads`, { headers: getHeaders() }).then(r => r.json()),
};
