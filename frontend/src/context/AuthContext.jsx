import { createContext, useContext, useState, useEffect } from "react";
import { setAuthToken } from "../api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("crm_token");
    if (token) {
      setAuthToken(token);
      // optional: decode JWT to get user info
    }
  }, []);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return (
    <AuthContext.Provider value={{ user, setUser, darkMode, toggleDarkMode }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
