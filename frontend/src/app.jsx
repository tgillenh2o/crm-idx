import React, { useState, useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";

export default function App() {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("crm_user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const toggleMode = () => setDarkMode(!darkMode);
  const switchToRegister = () => setShowLogin(false);
  const switchToLogin = () => setShowLogin(true);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
  };

  const onLoginSuccess = (u) => setUser(u);
  const onRegisterSuccess = (u) => setUser(u);

  return (
    <div className={darkMode ? "dark" : ""} style={{ padding: 16 }}>
      <button onClick={toggleMode} className="btn-toggle">
        Toggle {darkMode ? "Light" : "Dark"} Mode
      </button>

      {!user ? (
        showLogin ? (
          <Login onLoginSuccess={onLoginSuccess} switchToRegister={switchToRegister} />
        ) : (
          <Register
            onRegisterSuccess={onRegisterSuccess}
            switchToLogin={switchToLogin}
          />
        )
      ) : (
        <div>
          <h2>Welcome, {user.name}!</h2>
          <button onClick={handleLogout} className="btn btn-primary">
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
