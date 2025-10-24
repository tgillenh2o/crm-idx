import React, { createContext, useState, useEffect } from "react";
import { setAuthToken } from "../api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("crm_user");
    const token = localStorage.getItem("crm_token");
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      setAuthToken(token);
    }
  }, []);

  const loginUser = (user, token) => {
    localStorage.setItem("crm_user", JSON.stringify(user));
    setAuthToken(token);
    setUser(user);
  };

  const logoutUser = () => {
    localStorage.clear();
    setUser(null);
    setAuthToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};
