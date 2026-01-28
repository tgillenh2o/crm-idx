import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./Profile.css";

export default function Profile() {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    newPassword: "",
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      setProfile({ ...profile, name: user.name, email: user.email });
      setLoading(false);
    }
  }, [user]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const body = {
        name: profile.name,
        phone: profile.phone,
      };
      if (profile.newPassword.trim()) body.password = profile.newPassword;

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/me`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      const updated = await res.json();
      setMessage("Profile updated successfully!");
      setProfile({ ...profile, newPassword: "" });
    } catch (err) {
      console.error(err);
      setMessage("Error updating profile");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="profile-container">
      <h2>My Profile</h2>
      {message && <p className="profile-message">{message}</p>}

      <div className="profile-form">
        <label>Name</label>
        <input type="text" name="name" value={profile.name} onChange={handleChange} />

        <label>Email</label>
        <input type="email" name="email" value={profile.email} disabled />

        <label>Phone</label>
        <input type="text" name="phone" value={profile.phone || ""} onChange={handleChange} />

        <label>New Password</label>
        <input type="password" name="newPassword" value={profile.newPassword} onChange={handleChange} placeholder="Leave blank to keep current password" />

        <button onClick={handleSave}>Save Profile</button>
      </div>
    </div>
  );
}
