import React, { useState } from "react";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // API URL (matches backend deployed URL)
  const API_URL = "https://crm-idx.onrender.com/api";

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(API_URL + "/auth/login", { email, password });
      const { token, user } = res.data;

      // Store token in localStorage
      localStorage.setItem("crm_token", token);
      alert(`Welcome back, ${user.name}! You are now logged in.`);
      console.log("Logged in user:", user);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#121212",
        color: "white",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "2rem",
          background: "#1E1E1E",
          borderRadius: "12px",
          width: "400px",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "1.5rem",
            color: "#FF6B6B",
          }}
        >
          Log In
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            marginBottom: "1rem",
            padding: "0.8rem",
            borderRadius: "6px",
            border: "none",
            background: "#2C2C2C",
            color: "white",
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            marginBottom: "1.5rem",
            padding: "0.8rem",
            borderRadius: "6px",
            border: "none",
            background: "#2C2C2C",
            color: "white",
          }}
        />
        <button
          type="submit"
          style={{
            background: "#FF6B6B",
            color: "white",
            padding: "0.8rem",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Log In
        </button>
      </form>
    </div>
  );
}
