import React, { useState } from "react";
import { auth, setAuthToken } from "../api";

export default function Register({ switchPage, setUser }) {
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const res = await auth.register({ name, email, password });
      setUser(res.user);
      localStorage.setItem("crm_user", JSON.stringify(res.user));
      setAuthToken(res.token);
      alert("Registration successful! Confirmation email sent.");
    } catch (err) {
      alert("Registration failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister} className="card auth-form">
      <h3>Register</h3>
      <input name="name" placeholder="Full Name" required />
      <input name="email" type="email" placeholder="Email" required />
      <input name="password" type="password" placeholder="Password" required />
      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? "Registering..." : "Register"}
      </button>
      <p>
        Already have an account? <span className="link" onClick={switchPage}>Login</span>
      </p>
    </form>
  );
}
