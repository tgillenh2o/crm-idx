// src/pages/dashboard/Profile.jsx
import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./Dashboard.css";

export default function Profile() {
  const { user, refreshUser } = useContext(AuthContext);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${user._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Profile updated successfully!");
        refreshUser();
      } else {
        setMessage(data.message || "Failed to update profile.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Error saving profile.");
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div id="profile" className="profile-tab">
      <h2 className="section-title">Profile</h2>
      <div className="profile-card">
        <label>
          Name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label>
          Role
          <input type="text" value={user.role} disabled />
        </label>

        <button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>

        {message && <p className="profile-message">{message}</p>}
      </div>
    </div>
  );
}
