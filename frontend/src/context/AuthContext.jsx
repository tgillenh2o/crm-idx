import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check localStorage for token on mount
  useEffect(() => {
    const token = localStorage.getItem("crm_token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        // Make sure the payload has role
        setUser({
          id: payload.id,
          name: payload.name,
          email: payload.email,
          role: payload.role || "independent",
        });
      } catch (err) {
        console.error("Invalid token:", err);
        localStorage.removeItem("crm_token");
      }
    }
    setLoading(false);
  }, []);

  // Login: store token and user data
  const login = (token, userData) => {
    localStorage.setItem("crm_token", token);
    setUser({
      ...userData,
      role: userData.role || "independent", // ensure role exists
    });
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
