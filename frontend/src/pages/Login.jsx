import React, { useState } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext";

export default function Login({ switchToRegister }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", { email, password });

      const { token, user } = res.data;
      login(token, user.role);

      // Redirect based on role
      if (user.role === "teamAdmin") {
        window.location.href = "/dashboard/admin";
      } else {
        window.location.href = "/dashboard/member";
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
        <p>
          Don’t have an account?{" "}
          <button onClick={switchToRegister} className="link-btn">
            Register
          </button>
        </p>
      </div>
    </div>
  );
}
