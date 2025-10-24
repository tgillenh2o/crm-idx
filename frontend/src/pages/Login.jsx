import React, { useContext, useState } from "react";
import { auth } from "../api";
import { AuthContext } from "../context/AuthContext";

export default function LoginForm({ onToggle }) {
  const { loginUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await auth.login({ email, password });
      loginUser(res.user, res.token);
    } catch (err) {
      setError("Login failed");
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      <h3>Login</h3>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" />
      <button type="submit">Login</button>
      <p>
        No account? <span onClick={onToggle} style={{ cursor: "pointer", color: "blue" }}>Register</span>
      </p>
    </form>
  );
}
