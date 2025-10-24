// src/app.jsx
import React, { useState } from "react";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";

export default function App() {
  const [view, setView] = useState("login"); // toggle between 'login' and 'register'
  const [darkMode, setDarkMode] = useState(false);

  return (
    <AuthProvider>
      <div className={darkMode ? "app-container dark" : "app-container"}>
        <header style={{ display: "flex", justifyContent: "space-between", width: "100%", maxWidth: 400, marginBottom: 20 }}>
          <div>
            <button onClick={() => setView("login")} className={view === "login" ? "active" : ""}>
              Login
            </button>
            <button onClick={() => setView("register")} className={view === "register" ? "active" : ""}>
              Register
            </button>
          </div>
          <button onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </header>

        <div style={{ width: "100%", maxWidth: 400 }}>
          {view === "login" ? <Login /> : <Register />}
        </div>
      </div>
    </AuthProvider>
  );
}
