import React, { useState } from "react";
import { auth, setAuthToken } from "../api";

export default function Login({ onLoginSuccess, switchToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await auth.login({ email, password });
      setAuthToken(res.token);
      localStorage.setItem("crm_user", JSON.stringify(res.user));
      onLoginSuccess(res.user);
    } catch (err) {
      setError("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: 400, margin: "auto" }}>
      <h3>Login</h3>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <form onSubmit={handleLogin}>
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
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <div style={{ marginTop: 8 }}>
        Don't have an account?{" "}
        <button className="btn-link" onClick={switchToRegister}>
          Register
        </button>
      </div>
    </div>
  );
}
