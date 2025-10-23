// frontend/src/api.js
const API_URL = "https://crm-idx-backend.onrender.com/api"; // update if different

export const setAuthToken = (token) => {
  if (token) localStorage.setItem("crm_token", token);
  else localStorage.removeItem("crm_token");
};

async function handleResponse(res) {
  const text = await res.text().catch(() => "");
  try {
    const json = text ? JSON.parse(text) : {};
    if (!res.ok) throw new Error(json.error || json.message || text || `HTTP ${res.status}`);
    return json;
  } catch (err) {
    // if response is not JSON or JSON parsing failed
    if (!res.ok) throw new Error(text || `HTTP ${res.status}`);
    throw err;
  }
}

export const auth = {
  login: async (data) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  register: async (data) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
};

export const teams = {
  list: async () => {
    const token = localStorage.getItem("crm_token");
    const res = await fetch(`${API_URL}/teams`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return handleResponse(res);
  },
  create: async (payload) => {
    const token = localStorage.getItem("crm_token");
    const res = await fetch(`${API_URL}/teams`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },
};

export const invites = {
  invite: async (payload) => {
    const token = localStorage.getItem("crm_token");
    const res = await fetch(`${API_URL}/invites`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },
};

export const properties = {
  list: async () => {
    const token = localStorage.getItem("crm_token");
    const res = await fetch(`${API_URL}/properties`, { headers: { Authorization: `Bearer ${token}` }});
    return handleResponse(res);
  },
  sync: async () => {
    const token = localStorage.getItem("crm_token");
    const res = await fetch(`${API_URL}/properties/sync`, { method: "POST", headers: { Authorization: `Bearer ${token}` }});
    return handleResponse(res);
  },
  search: async (q) => {
    const token = localStorage.getItem("crm_token");
    const res = await fetch(`${API_URL}/properties/search?q=${encodeURIComponent(q)}`, { headers: { Authorization: `Bearer ${token}` }});
    return handleResponse(res);
  }
};

export const leads = {
  list: async () => {
    const token = localStorage.getItem("crm_token");
    const res = await fetch(`${API_URL}/leads`, { headers: { Authorization: `Bearer ${token}` }});
    return handleResponse(res);
  },
  create: async (payload) => {
    const token = localStorage.getItem("crm_token");
    const res = await fetch(`${API_URL}/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },
};
