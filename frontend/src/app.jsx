import React, { useState, useEffect } from "react";
import { auth, setAuthToken, users } from "./api";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminPanel from "./pages/AdminPanel";

export default function App() {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [showLogin, setShowLogin] = useState(true);

  // Restore user from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("crm_user");
    const token = localStorage.getItem("crm_token");
    if (stored && token) {
      setUser(JSON.parse(stored));
      setAuthToken(token);
    }
  }, []);

  // Logout
  const handleLogout = () => {
    setUser(null);
    setAuthToken(null);
    localStorage.removeItem("crm_user");
  };

  // Toggle dark mode
  const toggleDarkMode = () => setDarkMode(prev => !prev);

  // Toggle login/register view
  const toggleForm = () => setShowLogin(prev => !prev);

  return (
    <div style={{
      backgroundColor: darkMode ? "#111" : "#f5f5f5",
      color: darkMode ? "#f5f5f5" : "#111",
      minHeight: "100vh",
      padding: 20
    }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>CRM + IDX</h1>
        <div>
          <button onClick={toggleDarkMode}>
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
          {user && <button onClick={handleLogout} style={{ marginLeft: 10 }}>Logout</button>}
        </div>
      </header>

      {!user ? (
        <div style={{ maxWidth: 400, marginTop: 40 }}>
          {showLogin ? <Login setUser={setUser} /> : <Register />}
          <button onClick={toggleForm} style={{ marginTop: 10 }}>
            {showLogin ? "Switch to Register" : "Switch to Login"}
          </button>
        </div>
      ) : (
        <div style={{ marginTop: 40 }}>
          <h2>Welcome, {user.name} ({user.role})</h2>

          {/* Admin panel */}
          {user.role === "superAdmin" && <AdminPanel />}

          {/* Placeholder for team/user dashboards */}
          {user.role !== "superAdmin" && <p>Your personal dashboard goes here.</p>}
        </div>
      )}
    </div>
  );
}
