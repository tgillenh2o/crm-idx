import React, { useState } from "react";
import { auth, setAuthToken } from "../api";

export default function Login({ switchPage, setUser }) {
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const res = await auth.login({ email, password });
      setUser(res.user);
      localStorage.setItem("crm_user", JSON.stringify(res.user));
      setAuthToken(res.token);
    } catch (err) {
      alert("Login failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="card auth-form">
      <h3>Login</h3>
      <input name="email" type="email" placeholder="Email" required />
      <input name="password" type="password" placeholder="Password" required />
      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
      <p>
        No account? <span className="link" onClick={switchPage}>Register here</span>
      </p>
    </form>
  );
}
