import { createContext, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // LOGIN
  const login = async (email, password) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    if (!res.ok) return false;

    const data = await res.json();

    // ✅ Store token in localStorage
    if (data.token) {
      localStorage.setItem("token", data.token);
    } else {
      console.error("No token returned from backend!");
      return false;
    }

    // store user info in context
    setUser(data.user);

    return true;
  } catch (err) {
    console.error("Login error", err);
    return false;
  }
};


  // REGISTER
  const register = async (email, password, role = "teamMember") => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
        credentials: "include",
      });
      if (!res.ok) return false;
      const data = await res.json();
      // Auto-login after register
      setUser(data.user);
      return true;
    } catch (err) {
      console.error("Register error", err);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register }}>
      {children}
    </AuthContext.Provider>
  );
}
