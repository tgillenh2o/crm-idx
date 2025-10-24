import React, { createContext, useContext, useState, useEffect } from "react";
import { setAuthToken } from "../api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("crm_user");
    const token = localStorage.getItem("crm_token");
    const storedDark = localStorage.getItem("crm_darkMode");

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      setAuthToken(token);
    }

    if (storedDark) setDarkMode(storedDark === "true");
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      localStorage.setItem("crm_darkMode", !prev);
      return !prev;
    });
  };

  return (
    <AuthContext.Provider value={{ user, setUser, darkMode, toggleDarkMode }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
