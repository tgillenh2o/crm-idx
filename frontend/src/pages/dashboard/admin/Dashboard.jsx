// src/pages/dashboard/admin/Dashboard.jsx
import React from "react";
import { useAuth } from "../../../context/AuthContext";

export default function TeamAdminDashboard() {
  const { user, logout } = useAuth();

  return (
    <div style={{ padding: "40px", fontFamily: "Arial, sans-serif" }}>
      <header style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <h1>Team Admin Dashboard</h1>
        <button onClick={logout}>Logout</button>
      </header>
      <p>Welcome, {user?.role}!</p>
      <p>Here you can view all leads and manage your team.</p>
    </div>
  );
}
