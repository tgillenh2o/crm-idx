import React, { useContext, useState } from "react";
import { auth } from "../api";
import { AuthContext } from "../context/AuthContext";

export default function RegisterForm({ onToggle }) {
  const { loginUser } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await auth.register({ name, email, password });
      setSuccess("Registration successful! Check your email to confirm.");
      loginUser(res.user, res.token);
    } catch (err) {
      setError("Registration failed");
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      <h3>Register</h3>
      {error && <div style={{ color: "red" }}>{error}</div>}
      {success && <div style={{ color: "green" }}>{success}</div>}
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" />
      <button type="submit">Register</button>
      <p>
        Already have an account? <span onClick={onToggle} style={{ cursor: "pointer", color: "blue" }}>Login</span>
      </p>
    </form>
  );
}
