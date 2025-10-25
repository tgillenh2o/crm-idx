// frontend/src/pages/Register.jsx
import React, { useState } from "react";
import axios from "axios";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Your deployed backend URL
  const API_URL = "https://crm-idx.onrender.com/api";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { name, email, password };
      const res = await axios.post(`${API_URL}/auth/register`, payload);
      alert(res.data.message || "Registration successful! Please check your email for confirmation.");
      setName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Registration failed. Please try again.";
      alert(msg);
    } finally {
      setLoading(false);
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
          Create Account
        </h2>

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
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
          disabled={loading}
          style={{
            background: "#FF6B6B",
            color: "white",
            padding: "0.8rem",
            border: "none",
            borderRadius: "6px",
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: "bold",
          }}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}
