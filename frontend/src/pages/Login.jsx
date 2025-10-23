import React, { useState } from "react";
import api from "../api";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleMode = () => setIsLogin(!isLogin);
  const toggleDark = () => setDarkMode(!darkMode);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const { data } = await api.post(endpoint, formData);

      if (data.error) throw new Error(data.error);
      if (isLogin) {
        localStorage.setItem("crm_token", data.token);
        localStorage.setItem("crm_user", JSON.stringify(data.user));
        setMessage("✅ Login successful! Redirecting...");
        setTimeout(() => (window.location.href = "/"), 1500);
      } else {
        setMessage("✅ Registration successful! You can now log in.");
        setIsLogin(true);
      }
    } catch (err) {
      setMessage(`❌ ${err.message || "Something went wrong"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: darkMode ? "#111827" : "#f3f4f6",
        color: darkMode ? "#f9fafb" : "#111827",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        padding: 20,
        transition: "all 0.3s",
      }}
    >
      <div
        style={{
          background: darkMode ? "#1f2937" : "#fff",
          padding: 30,
          borderRadius: 12,
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          width: "100%",
          maxWidth: 400,
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: 20 }}>
          {isLogin ? "Welcome Back 👋" : "Create Account 🏡"}
        </h2>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              value={formData.name}
              required
              style={styles.input}
            />
          )}
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            value={formData.email}
            required
            style={styles.input}
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            value={formData.password}
            required
            style={styles.input}
          />
          <button
            type="submit"
            style={styles.button(darkMode)}
            disabled={loading}
          >
            {loading ? "Loading..." : isLogin ? "Login" : "Register"}
          </button>
        </form>

        {message && (
          <div style={{ marginTop: 10, fontSize: 14, opacity: 0.8 }}>
            {message}
          </div>
        )}

        <div style={{ marginTop: 16 }}>
          <button onClick={toggleMode} style={styles.link}>
            {isLogin ? "Need an account? Register" : "Have an account? Login"}
          </button>
        </div>

        <div style={{ marginTop: 20 }}>
          <button onClick={toggleDark} style={styles.darkToggle}>
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  input: {
    display: "block",
    width: "100%",
    padding: "10px 12px",
    marginBottom: 12,
    borderRadius: 8,
    border: "1px solid #d1d5db",
    fontSize: 14,
  },
  button: (dark) => ({
    width: "100%",
    padding: "10px 0",
    background: dark ? "#2563eb" : "#1e40af",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: "bold",
    transition: "0.2s",
  }),
  link: {
    background: "none",
    border: "none",
    color: "#3b82f6",
    cursor: "pointer",
    textDecoration: "underline",
    fontSize: 14,
  },
  darkToggle: {
    background: "none",
    border: "1px solid #6b7280",
    borderRadius: 8,
    padding: "6px 12px",
    fontSize: 14,
    cursor: "pointer",
  },
};
