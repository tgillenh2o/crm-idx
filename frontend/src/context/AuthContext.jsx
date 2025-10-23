// frontend/src/context/AuthContext.jsx
import React, { createContext, useEffect, useState } from "react";
import { setAuthToken } from "../api";

export const AuthContext = createContext({
  user: null,
  setUser: () => {},
  logout: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("crm_user");
    const token = localStorage.getItem("crm_token");
    if (stored && token) {
      setUser(JSON.parse(stored));
      setAuthToken(token);
    }
  }, []);

  function logout() {
    localStorage.removeItem("crm_user");
    setAuthToken(null);
    localStorage.removeItem("crm_token");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
