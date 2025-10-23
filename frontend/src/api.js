const API_URL = "https://crm-idx-backend.onrender.com/api"; // Replace with your backend URL

// Helper to store/remove token
export const setAuthToken = (token) => {
  if (token) localStorage.setItem("crm_token", token);
  else localStorage.removeItem("crm_token");
};

// Generic fetch wrapper to handle JSON and errors
async function fetchJson(url, options = {}) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "API request failed");
  return data;
}

// ----- AUTH -----
export const auth = {
  login: async (payload) => {
    return fetchJson(`${API_URL}/auth/login`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  register: async (payload) => {
    return fetchJson(`${API_URL}/auth/register`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};

// ----- PROPERTIES -----
export const properties = {
  list: async () => {
    const token = localStorage.getItem("crm_token");
    return fetchJson(`${API_URL}/properties`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  sync: async () => {
    const token = localStorage.getItem("crm_token");
    return fetchJson(`${API_URL}/properties/sync`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};

// ----- INVITES -----
export const invites = {
  list: async () => {
    const token = localStorage.getItem("crm_token");
    return fetchJson(`${API_URL}/invites`, {
      headers: { Authorization:
