import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./Profile.css";

export default function Profile() {
  const { user } = useContext(AuthContext);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  useEffect(() => {
    if (user) setForm({ name: user.name, email: user.email, password: "" });
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/me`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(form),
      });
      const updated = await res.json();
      alert("Profile updated!");
      setForm({ ...form, password: "" });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="profile-card">
      <h3>Profile</h3>
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input name="name" value={form.name} onChange={handleChange} />
        <label>Email:</label>
        <input name="email" value={form.email} disabled />
        <label>Password:</label>
        <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="New password" />
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}
