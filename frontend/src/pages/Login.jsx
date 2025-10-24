import { useState } from "react";
import { auth, setAuthToken } from "../api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { setUser, darkMode, toggleDarkMode } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await auth.login(form);
      if (res.token) {
        setAuthToken(res.token);
        setUser(res.user);
      }
      setMessage(res.message);
    } catch (err) {
      setMessage(err.message || "Login failed");
    }
  };

  return (
    <div className={`auth-container ${darkMode ? "dark" : ""}`}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input name="email" placeholder="Email" onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} />
        <button type="submit">Login</button>
      </form>
      <button onClick={toggleDarkMode}>
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}
