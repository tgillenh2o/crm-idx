import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const API_URL = "https://crm-idx.onrender.com/api";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      localStorage.setItem("user", email);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#121212",
        color: "white",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "2rem",
          background: "#1E1E1E",
          borderRadius: "12px",
          width: "400px",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "1.5rem", color: "#FF6B6B" }}>
          Login
        </h2>
        {error && <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            marginBottom: "1rem",
            padding: "0.8rem",
            borderRadius: "6px",
            border: "none",
            background: "#2C2C2C",
            color: "white",
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            marginBottom: "1.5rem",
            padding: "0.8rem",
            borderRadius: "6px",
            border: "none",
            background: "#2C2C2C",
            color: "white",
          }}
        />
        <button
          type="submit"
          style={{
            background: "#FF6B6B",
            color: "white",
            padding: "0.8rem",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Login
        </button>

        {/* 👇 Added Register link */}
        <p style={{ textAlign: "center", marginTop: "1rem" }}>
          Don’t have an account?{" "}
          <Link to="/register" style={{ color: "#FF6B6B", textDecoration: "none" }}>
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
