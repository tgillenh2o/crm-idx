import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check localStorage for token on mount
  useEffect(() => {
    const token = localStorage.getItem("crm_token");
    if (token) {
      // Optionally decode token to get user info
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser({ id: payload.id });
      } catch (err) {
        console.error("Invalid token:", err);
        localStorage.removeItem("crm_token");
      }
    }
    setLoading(false);
  }, []);

  const login = (token, userData) => {
    localStorage.setItem("crm_token", token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("crm_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
