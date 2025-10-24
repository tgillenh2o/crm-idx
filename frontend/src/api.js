// src/api.js

import axios from "axios";

// Auto-detect backend base URL (for Render or local dev)
const API_URL =
  import.meta.env.VITE_BACKEND_URL ||
  "https://crm-idx.onrender.com";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach auth token
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

// ---- AUTH ----
export const auth = {
  async login(data) {
    const res = await api.post("/auth/login", data);
    return res.data;
  },
  async register(data) {
    const res = await api.post("/auth/register", data);
    return res.data;
  },
  async me() {
    const res = await api.get("/auth/me");
    return res.data;
  },
};

// ---- PROPERTIES ----
export const properties = {
  async list() {
    const res = await api.get("/properties");
    return res.data;
  },
  async sync() {
    const res = await api.post("/properties/sync");
    return res.data;
  },
};

// ---- INVITES ----
export const invites = {
  async list() {
    const res = await api.get("/invites");
    return res.data;
  },
  async send(data) {
    const res = await api.post("/invites", data);
    return res.data;
  },
};

// ---- LEADS ----
export const leads = {
  async list() {
    const res = await api.get("/leads");
    return res.data;
  },
  async add(data) {
    const res = await api.post("/leads", data);
    return res.data;
  },
};

export default { auth, properties, invites, leads, setAuthToken };
