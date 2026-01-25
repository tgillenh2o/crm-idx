import React, { useState } from "react";

export default function AddLead({ onLeadAdded, currentUser, isAdmin }) {
  const [showForm, setShowForm] = useState(false);
  const [newLead, setNewLead] = useState({
    name: "",
    email: "",
    phone: "",
    status: "New",
    assignedTo: currentUser?.email || "POND",
  });

  const handleAddLead = async (e) => {
    e.preventDefault();
    const leadToAdd = { ...newLead, assignedTo: currentUser?.email || "POND" };

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
            value={newLead.phone}
            onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
            required
          />
          <select
            value={newLead.status}
            onChange={(e) => setNewLead({ ...newLead, status: e.target.value })}
          >
            <option value="New">New</option>
            <option value="Follow-up">Follow-up</option>
            <option value="Contacted">Contacted</option>
            <option value="Closed">Closed</option>
          </select>
          <button type="submit" className="submit-lead-btn">
            Add Lead
          </button>
        </form>
      )}
    </div>
  );
}
