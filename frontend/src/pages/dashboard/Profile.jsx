import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./Dashboard.css";

export default function Profile() {
  const { user, refreshUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${user._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to save profile");

      const updatedUser = await res.json();
      setMessage("Profile updated successfully!");
      refreshUser(updatedUser); // update context
    } catch (err) {
      console.error(err);
      setMessage("Error updating profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div id="profile" className="profile-section">
      <h2>My Profile</h2>
      <div className="profile-form">
        <label>
          Name:
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name"
          />
        </label>
        <label>
          Email:
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your Email"
          />
        </label>
        <label>
          Phone:
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Your Phone"
          />
        </label>

        <button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>

        {message && <p className="profile-message">{message}</p>}
      </div>
    </div>
  );
}
