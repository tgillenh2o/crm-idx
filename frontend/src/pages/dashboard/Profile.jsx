import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function Profile() {
  const { user, setUser } = useContext(AuthContext);

  const [form, setForm] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  // Load current user info
  useEffect(() => {
    if (user) {
      setForm(prev => ({ ...prev, name: user.name, email: user.email }));
    }
  }, [user]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage(null);

    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      setMessage("New password and confirmation do not match");
      return;
    }

    setSaving(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/me`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          currentPassword: form.currentPassword,
          newPassword: form.newPassword
        })
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("Profile updated successfully!");
        // update context user
        setUser(prev => ({ ...prev, name: data.name, email: data.email }));
        setForm(prev => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }));
      } else {
        setMessage(data.message || "Failed to update profile");
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="profile-container">
      <h2>Edit Profile</h2>
      {message && <div className="message">{message}</div>}

      <form onSubmit={handleSubmit} className="profile-form">
        <label>
          Name
          <input type="text" name="name" value={form.name} onChange={handleChange} required />
        </label>

        <label>
          Email
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </label>

        <h4>Change Password</h4>
        <label>
          Current Password
          <input type="password" name="currentPassword" value={form.currentPassword} onChange={handleChange} />
        </label>
        <label>
          New Password
          <input type="password" name="newPassword" value={form.newPassword} onChange={handleChange} />
        </label>
        <label>
          Confirm New Password
          <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} />
        </label>

        <button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</button>
      </form>
    </div>
  );
}
