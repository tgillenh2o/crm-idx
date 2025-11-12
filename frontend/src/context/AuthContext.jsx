import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // <-- added

  // Load saved login on refresh
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token && role) {
      setUser({ token, role });
    }
    setLoading(false); // now this is defined
  }, []);

  // Login — called after successful API response
  const login = (token, role) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    setUser({ token, role });
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use in components
export const useAuth = () => useContext(AuthContext);
