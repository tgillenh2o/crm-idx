import React, { createContext, useState } from "react";
import axios from "axios";

// ✅ Always use your Render backend URL
axios.defaults.withCredentials = true;
axios.defaults.baseURL = "https://com-idx.onrender.com";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    try {
      const res = await axios.post("/login", { email, password });
      setUser(res.data.user);
      return true;
    } catch (err) {
      console.error("LOGIN ERROR:", err.response?.data || err.message);
      return false;
    }
  };

  const register = async (email, password) => {
    try {
      const res = await axios.post("/register", { email, password });
      return res.data.success;
    } catch (err) {
      console.error("REGISTER ERROR:", err.response?.data || err.message);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register }}>
      {children}
    </AuthContext.Provider>
  );
}
