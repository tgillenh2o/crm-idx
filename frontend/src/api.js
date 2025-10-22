const API_URL = "https://crm-idx-backend.onrender.com/api"; // replace with your backend URL

// ------------------ Auth Token ------------------
export const setAuthToken = (token) => {
  if (token) localStorage.setItem("crm_token", token);
  else localStorage.removeItem("crm_token");
};

// ------------------ Auth ------------------
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

// ------------------ Teams ------------------
export const teams = {
  list: async (token) => {
    const res = await fetch(`${API_URL}/teams`, {
      headers: { Authorization: `Bearer ${token || localStorage.getItem("crm_token")}` },
    });
    return res.json();
  },
};

// ------------------ Invites ------------------
export const invites = {
  list: async (token) => {
    const res = await fetch(`${API_URL}/invites`, {
      headers: { Authorization: `Bearer ${token || localStorage.getItem("crm_token")}` },
    });
    return res.json();
  },
};

// ------------------ Properties ------------------
export const properties = {
  list: async (token) => {
    const t = token || localStorage.getItem("crm_token");
    const res = await fetch(`${API_URL}/properties`, {
      headers: { Authorization: `Bearer ${t}` },
    });
    const data = await res.json();

    // Filter based on user role
    const user = JSON.parse(localStorage.getItem("crm_user"));
    if (!user) return data;
    if (user.role === "agent") {
      return { data: (data.data || []).filter((p) => p.ownerId === user._id) };
    }
    return data; // teamAdmin sees all team properties
  },

  sync: async (token) => {
    const t = token || localStorage.getItem("crm_token");
    const res = await fetch(`${API_URL}/properties/sync`, {
      method: "POST",
      headers: { Authorization: `Bearer ${t}` },
    });
    return res.json();
  },
};

// ------------------ Leads ------------------
export const leads = {
  list: async (token) => {
    const t = token || localStorage.getItem("crm_token");
    const res = await fetch(`${API_URL}/leads`, {
      headers: { Authorization: `Bearer ${t}` },
    });
    const data = await res.json();

    // Filter based on user role
    const user = JSON.parse(localStorage.getItem("crm_user"));
    if (!user) return data;
    if (user.role === "agent") {
      return { data: (data.data || []).filter((l) => l.ownerId === user._id) };
    }
    return data; // teamAdmin sees all team leads
  },
};
