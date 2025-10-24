import React, { useState } from "react";
import { auth, setAuthToken } from "../api";

export default function Register({ onRegisterSuccess, switchToLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await auth.register({ name, email, password });
      setAuthToken(res.token);
      localStorage.setItem("crm_user", JSON.stringify(res.user));
      onRegisterSuccess(res.user);
    } catch (err) {
      setError("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: 400, margin: "auto" }}>
      <h3>Register</h3>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <form onSubmit={handleRegister}>
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input"
        />
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
      <div style={{ marginTop: 8 }}>
        Already have an account?{" "}
        <button className="btn-link" onClick={switchToLogin}>
          Login
        </button>
      </div>
    </div>
  );
}
