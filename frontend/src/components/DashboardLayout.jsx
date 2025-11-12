import React from "react";

export default function DashboardLayout({ children }) {
  return (
    <div style={{
      backgroundColor: "#f4f4f4",
      minHeight: "100vh",
      color: "#333",
      display: "flex",
      flexDirection: "column",
      fontFamily: "Inter, sans-serif"
    }}>
      <header style={{
        backgroundColor: "#222",
        color: "white",
        padding: "1rem 2rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <h1 style={{ fontSize: "1.5rem" }}>CRM Dashboard</h1>
      </header>

      <main style={{ flex: 1, padding: "2rem" }}>
        {children}
      </main>
    </div>
  );
}
