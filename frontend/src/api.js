const API_URL = "https://crm-idx.onrender.com/api"; // Render backend

export const setAuthToken = (token) => {
  if (token) localStorage.setItem("crm_token", token);
  else localStorage.removeItem("crm_token");
};

const handleFetch = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `Request failed with status ${res.status}`);
  return data;
};

// Auth
export const auth = {
  login: async (data) => handleFetch(await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })),
  
  register: async (data) => handleFetch(await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  }))
};

// Protected endpoints
const getHeaders = () => {
  const token = localStorage.getItem("crm_token");
  return { Authorization: `Bearer ${token}` };
};

export const teams = {
  list: async () => handleFetch(await fetch(`${API_URL}/teams`, { headers: getHeaders() }))
};

export const invites = {
  list: async () => handleFetch(await fetch(`${API_URL}/invites`, { headers: getHeaders() }))
};

export const properties = {
  list: async () => handleFetch(await fetch(`${API_URL}/properties`, { headers: getHeaders() })),
  sync: async () => handleFetch(await fetch(`${API_URL}/properties/sync`, { method: "POST", headers: getHeaders() }))
};

export const leads = {
  list: async () => handleFetch(await fetch(`${API_URL}/leads`, { headers: getHeaders() }))
};
