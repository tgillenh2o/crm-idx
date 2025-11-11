// src/pages/Login.jsx
import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../api";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      const { token, user } = res.data;
      login(token, user);

      // Route based on role
      if (user.role === "teamAdmin") navigate("/dashboard/admin");
      else if (user.role === "teamMember") navigate("/dashboard/member");
      else navigate("/dashboard");
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #0f172a, #1e293b)",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "#fff",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          background: "#1e293b",
          padding: "40px",
          borderRadius: "12px",
          boxShadow: "0 0 20px rgba(0,0,0,0.5)",
          width: "350px",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Login</h2>
        {error && <p style={{ color: "#f87171", textAlign: "center" }}>{error}</p>}
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "15px" }}>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "5px",
                borderRadius: "6px",
                border: "1px solid #334155",
                background: "#0f172a",
                color: "#fff",
              }}
            />
          </div>
          <div style={{ marginBottom: "20px" }}>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "5px",
                borderRadius: "6px",
                border: "1px solid #334155",
                background: "#0f172a",
                color: "#fff",
              }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "10px",
              border: "none",
              borderRadius: "6px",
              background: loading ? "#475569" : "#3b82f6",
              color: "#fff",
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: "bold",
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p style={{ textAlign: "center", marginTop: "20px" }}>
          Don’t have an account?{" "}
          <Link to="/register" style={{ color: "#3b82f6", textDecoration: "none" }}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
