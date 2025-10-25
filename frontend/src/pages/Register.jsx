import React, { useState } from "react";
import axios from "axios";
export default function Register() {
const [formData, setFormData] = useState({
name: "",
email: "",
password: "",
});
const handleChange = (e) => {
setFormData({ ...formData, [e.target.name]: e.target.value });
};
const handleSubmit = async (e) => {
e.preventDefault();
try {
const res = await axios.post(${import.meta.env.VITE_API_URL}/auth/register, formData);
alert("Registration successful! Please check your email for confirmation.");
console.log(res.data);
} catch (err) {
console.error(err.response?.data || err.message);
alert(err.response?.data?.message || "Registration failed");
}
};
return (
<div
className="register-container"
style={{
color: "white",
background: "#121212",
minHeight: "100vh",
display: "flex",
alignItems: "center",
justifyContent: "center",
}}
>
<form
onSubmit={handleSubmit}
style={{
display: "flex",
flexDirection: "column",
maxWidth: "400px",
width: "100%",
background: "#1E1E1E",
padding: "2rem",
borderRadius: "12px",
boxShadow: "0 0 15px rgba(255,255,255,0.05)",
}}
>
<h2 style={{ textAlign: "center", marginBottom: "1.5rem", color: "#FF6B6B" }}>
Create Account
</h2>
    <input
      type="text"
      name="name"
      placeholder="Full Name"
      value={formData.name}
      onChange={handleChange}
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
      type="email"
      name="email"
      placeholder="Email Address"
      value={formData.email}
      onChange={handleChange}
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
      name="password"
      placeholder="Password"
      value={formData.password}
      onChange={handleChange}
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
        transition: "background 0.3s ease",
      }}
      onMouseOver={(e) => (e.target.style.background = "#FF8787")}
      onMouseOut={(e) => (e.target.style.background = "#FF6B6B")}
    >
      Register
    </button>
  </form>
</div>
