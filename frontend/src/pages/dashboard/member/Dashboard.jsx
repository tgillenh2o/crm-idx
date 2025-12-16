// src/pages/dashboard/member/Dashboard.jsx
import React from "react";
import { useAuth } from "../../../context/AuthContext";

export default function TeamMemberDashboard() {
  const { user, logout } = useAuth();

  return (
    <div style={{ padding: "40px", fontFamily: "Arial, sans-serif" }}>
      <header style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <h1>Team Member Dashboard</h1>
        <button onClick={logout}>Logout</button>
      </header>
      <p>Welcome, {user?.role}!</p>
      <p>Here you can view your leads and move them to the pond.</p>
    </div>
  );
}
