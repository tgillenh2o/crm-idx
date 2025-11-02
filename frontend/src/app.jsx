import React, { useState, useContext } from "react";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
Import Verified from "./pages/Verified";

function AppContent() {
  const { user, logout } = useContext(AuthContext);
  const [view, setView] = useState("login");

  // If user is logged in, show welcome and logout
  if (user) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "#121212",
          color: "white",
        }}
      >
        <h2 style={{ marginBottom: "1rem" }}>
          Welcome, {user.name || "User"}!
        </h2>
        <button
          onClick={logout}
          style={{
            background: "#FF6B6B",
            border: "none",
            padding: "0.8rem 1.2rem",
            borderRadius: "6px",
            cursor: "pointer",
            color: "white",
            fontWeight: "bold",
          }}
        >
          Logout
        </button>
      </div>
    );
  }

  // If not logged in, show login/register toggle
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#121212",
      }}
    >
      <header style={{ marginBottom: "2rem" }}>
        <button
          onClick={() => setView("login")}
          style={{
            marginRight: "1rem",
            padding: "0.6rem 1.2rem",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
            background: view === "login" ? "#FF6B6B" : "#2C2C2C",
            color: "white",
            fontWeight: "bold",
          }}
        >
          Login
        </button>
        <button
          onClick={() => setView("register")}
          style={{
            padding: "0.6rem 1.2rem",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
            background: view === "register" ? "#FF6B6B" : "#2C2C2C",
            color: "white",
            fontWeight: "bold",
          }}
        >
          Register
        </button>
      </header>
      <div>{view === "login" ? <Login /> : <Register />}</div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
