import { useState } from "react";
import { auth, setAuthToken } from "../api";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { setUser, darkMode, toggleDarkMode } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await auth.register(form);
      setAuthToken(res.token);
      setUser(res.user);
      setMessage(res.message);
    } catch (err) {
      setMessage(err.message || "Registration failed");
    }
  };

  return (
    <div className={`auth-container ${darkMode ? "dark" : ""}`}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
        />
        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />
        <button type="submit">Register</button>
      </form>
      <button onClick={toggleDarkMode}>
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>
      {message && <p className="message">{message}</p>}
    </div>
  );
}
