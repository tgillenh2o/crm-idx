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
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/auth/login`,
      { email, password }
    );

    setUser(res.data.user);
    return true;
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return false;
  }
};


  const register = async (email, password) => {
  try {
    await axios.post(
      `${import.meta.env.VITE_API_URL}/api/auth/register`,
      { email, password }
    );
    return true;
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return false;
  }
};


  return (
    <AuthContext.Provider value={{ user, login, register }}>
      {children}
    </AuthContext.Provider>
  );
}
