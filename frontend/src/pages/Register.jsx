import React, { useState } from "react";
import axios from "axios";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // store server errors
  const [success, setSuccess] = useState(""); // store success messages

  const API_URL = "https://crm-idx.onrender.com/api";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await axios.post(`${API_URL}/auth/register`, { name, email, password });
      setSuccess(res.data.message);
      setName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      if (err.response && err.response.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Registration failed. Please try again.");
      }
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#121212", color: "white" }}>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", padding: "2rem", background: "#1E1E1E", borderRadius: "12px", width: "400px" }}>
        <h2 style={{ textAlign: "center", marginBottom: "1.5rem", color: "#FF6B6B" }}>Create Account</h2>

        {error && <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>}
        {success && <p style={{ color: "#4BB543", marginBottom: "1rem" }}>{success}</p>}

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ marginBottom: "1rem", padding: "0.8rem", borderRadius: "6px", border: "none", background: "#2C2C2C", color: "white" }}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ marginBottom: "1rem", padding: "0.8rem", borderRadius: "6px", border: "none", background: "#2C2C2C", color: "white" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ marginBottom: "1.5rem", padding: "0.8rem", borderRadius: "6px", border: "none", background: "#2C2C2C", color: "white" }}
        />
        <button
          type="submit"
          style={{ background: "#FF6B6B", color: "white", padding: "0.8rem", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
        >
          Register
        </button>
      </form>
    </div>
  );
}
