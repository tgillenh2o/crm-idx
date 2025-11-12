import React, { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./styles.css";

export default function App() {
  const [view, setView] = useState("login");

  return (
    <div className="app-container">
      {view === "login" ? (
        <Login switchToRegister={() => setView("register")} />
      ) : (
        <Register switchToLogin={() => setView("login")} />
      )}
    </div>
  );
}
