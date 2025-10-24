const API_URL = "https://crm-idx.onrender.com/api";

export const setAuthToken = token => {
  if (token) localStorage.setItem("crm_token", token);
  else localStorage.removeItem("crm_token");
};

export const auth = {
  login: async data => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Login failed: ${res.status}`);
    return res.json();
  },
  register: async data => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Register failed: ${res.status}`);
    return res.json();
  },
};
