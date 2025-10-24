// src/components/Register.jsx
import React, { useState } from "react";
import { auth, setAuthToken } from "../api";

export default function Register({ onSuccess }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await auth.register(form);
      if (res.token) {
        setAuthToken(res.token);
        setMessage("✅ Registration successful!");
        onSuccess && onSuccess();
      } else {
        setMessage(res.message || "Registration failed.");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setMessage(`❌ ${err.message || "Registration failed."}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      {message && <p className="message">{message}</p>}
    </div>
  );
}
