import React, { useState } from "react";

export default function AddLead({ onLeadAdded, currentUser }) {
  const [showForm, setShowForm] = useState(false);
  const [newLead, setNewLead] = useState({
    name: "",
    email: "",
    phone: "",
    status: "New",
  });

  const handleAddLead = async (e) => {
    e.preventDefault();

    // ALWAYS include assignedTo in the POST body
    const leadToAdd = { 
      ...newLead, 
      assignedTo: currentUser?.email || "POND" 
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(leadToAdd),
      });

      if (!res.ok) throw new Error("Failed to add lead");

      const savedLead = await res.json();
      onLeadAdded(savedLead);

      // Reset form
      setNewLead({ name: "", email: "", phone: "", status: "New" });
      setShowForm(false);
    } catch (err) {
      console.error("Add lead error:", err);
      alert("Failed to add lead. Check console for details.");
    }
  };

  return (
    <div className="add-lead-container">
      <button
        type="button"
        className="toggle-form-btn"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? "Cancel" : "Add New Lead"}
      </button>

      {showForm && (
        <form className="add-lead-form" onSubmit={handleAddLead}>
          <input
            type="text"
            placeholder="Full Name"
            value={newLead.name}
            onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={newLead.email}
            onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Phone"
            value
