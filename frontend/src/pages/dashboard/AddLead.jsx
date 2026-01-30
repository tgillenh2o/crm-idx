import React, { useState } from "react";

export default function AddLead({ onLeadAdded, isAdmin, currentUserEmail }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    status: "New"
  });

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault(); // 🔴 REQUIRED

    const payload = {
      ...form,
      assignedTo: isAdmin ? "" : currentUserEmail
    };

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/leads`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(payload)
      }
    );

    const newLead = await res.json();

    onLeadAdded(newLead); // 🔴 THIS closes the form + updates dashboard
  };

  return (
    <form className="add-lead-form" onSubmit={handleSubmit}>
      <input name="name" placeholder="Name" onChange={handleChange} required />
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input name="phone" placeholder="Phone" onChange={handleChange} />
      <button type="submit">Save Lead</button>
    </form>
  );
}
