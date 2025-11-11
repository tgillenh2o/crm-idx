import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(name, email, password);
      setMessage("Registration successful! Please check your email to verify.");
      setError("");
    } catch (err) {
      setError("Registration failed. Try again.");
      setMessage("");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Account</h2>
        <p style={styles.subtitle}>Join the platform today</p>
        {message && <p style={styles.success}>{message}</p>}
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button}>Register</button>
        </form>
        <p style={styles.footer}>
          Already have an account?{" "}
          <a href="/login" style={styles.link}>
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

const styles = {
  ...JSON.parse(JSON.stringify((() => ({
    container: {
      background: "linear-gradient(135deg, #111827, #1f2937, #111827)",
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "Inter, sans-serif",
    },
    card: {
      background: "#fff",
      borderRadius: "12px",
      boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
      padding: "40px",
      width: "100%",
      maxWidth: "400px",
      textAlign: "center",
    },
    title: {
      fontSize: "1.8rem",
      fontWeight: "700",
      color: "#111827",
      marginBottom: "8px",
    },
    subtitle: {
      color: "#6b7280",
      marginBottom: "20px",
    },
    success: {
      color: "#065f46",
      backgroundColor: "#d1fae5",
      borderRadius: "6px",
      padding: "8px",
      marginBottom: "12px",
      fontSize: "0.9rem",
    },
    error: {
      color: "#dc2626",
      backgroundColor: "#fee2e2",
      borderRadius: "6px",
      padding: "8px",
      marginBottom: "12px",
      fontSize: "0.9rem",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "12px",
    },
    input: {
      padding: "12px",
      borderRadius: "6px",
      border: "1px solid #d1d5db",
      fontSize: "1rem",
    },
    button: {
      backgroundColor: "#2563eb",
      color: "white",
      border: "none",
      padding: "12px",
      borderRadius: "6px",
      fontSize: "1rem",
      fontWeight: "600",
      cursor: "pointer",
      transition: "0.2s",
    },
    footer: {
      marginTop: "18px",
      fontSize: "0.9rem",
      color: "#6b7280",
    },
    link: {
      color: "#2563eb",
      textDecoration: "none",
      fontWeight: "600",
    },
  }))())),
};
