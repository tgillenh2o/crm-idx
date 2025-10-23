// frontend/src/components/Login.jsx
import React, { useState, useContext } from "react";
import { auth } from "../api";
import { AuthContext } from "../context/AuthContext";

export default function Login({ switchToRegister }) {
  const { setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const email = e.target.email.value.trim();
      const password = e.target.password.value;
      const res = await auth.login({ email, password });
      // res expected: { success: true, user: {...}, token: "..." } OR error thrown
      if (res && res.user && res.token) {
        localStorage.setItem("crm_user", JSON.stringify(res.user));
        localStorage.setItem("crm_token", res.token);
        setUser(res.user);
      } else {
        setErr("Unexpected response from server");
      }
    } catch (error) {
      setErr(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <h3>Login</h3>
      {err && <div style={{ color: "#991b1b", marginBottom: 8 }}>{err}</div>}
      <form onSubmit={handleSubmit}>
        <input name="email" className="input" placeholder="Email" required />
        <div style={{ position: "relative", marginTop: 8 }}>
          <input name="password" className="input" placeholder="Password" type={showPassword ? "text" : "password"} required />
          <button type="button" onClick={() => setShowPassword(v => !v)} style={{ position: "absolute", right: 8, top: 8 }}>
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
          <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
          <button type="button" className="btn" onClick={switchToRegister}>Register</button>
        </div>
      </form>
    </div>
  );
}
