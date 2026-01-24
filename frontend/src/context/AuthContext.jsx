import { createContext, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Login function
  const login = async (email, password) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Login failed:", errorData);
        return false;
      }

      const data = await res.json();
      setUser(data.user);
      return true;
    } catch (err) {
      console.error("Login error:", err);
      return false;
    }
  };

  // Register function with auto-login
  const register = async (email, password, role) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Register failed:", errorData);
        return false;
      }

      const data = await res.json();
      setUser(data.user); // auto-login after register
      return true;
    } catch (err) {
      console.error("Register error:", err);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, register }}>
      {children}
    </AuthContext.Provider>
  );
}
