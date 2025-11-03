// src/pages/Home.jsx
import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user"); // or your token logic
    if (!user) {
      navigate("/login"); // redirect if not logged in
    }
  }, [navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "3rem" }}>
      <h1>Welcome to CRM IDX</h1>
      <p>
        <Link to="/register" style={{ marginRight: "1rem" }}>Register</Link>
        <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
