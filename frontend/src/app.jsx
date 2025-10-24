import React, { useState } from "react";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";

export default function App() {
  const [view, setView] = useState("login");

  return (
    <AuthProvider>
      <div className="app-container">
        <header>
          <div>
            <button
              onClick={() => setView("login")}
              className={view === "login" ? "active" : ""}
            >
              Login
            </button>
            <button
              onClick={() => setView("register")}
              className={view === "register" ? "active" : ""}
            >
              Register
            </button>
          </div>
        </header>
        <div>
          {view === "login" ? <Login /> : <Register />}
        </div>
      </div>
    </AuthProvider>
  );
}
