const API_URL = "https://crm-idx.onrender.com/api"; // Render backend

export const setAuthToken = (token) => {
  if (token) localStorage.setItem("crm_token", token);
  else localStorage.removeItem("crm_token");
};

const getHeaders = () => {
  const token = localStorage.getItem("crm_token");
  return { Authorization: `Bearer ${token}` };
};

// === Auth ===
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

  confirmEmail: async (token) => {
    const res = await fetch(`${API_URL}/auth/confirm/${token}`);
    return res.json();
  },
};

// === Teams ===
export const teams = {
  list: async () => {
    const res = await fetch(`${API_URL}/teams`, { headers: getHeaders() });
    return res.json();
  },
};

// === Properties ===
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

// === Leads ===
export const leads = {
  list: async () => {
    const res = await fetch(`${API_URL}/leads`, { headers: getHeaders() });
    return res.json();
  },
};

// === Invites ===
export const invites = {
  list: async () => {
    const res = await fetch(`${API_URL}/invites`, { headers: getHeaders() });
    return res.json();
  },
};
