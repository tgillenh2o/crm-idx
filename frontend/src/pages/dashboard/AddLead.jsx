import { useState } from "react";

export default function AddLead({ onLeadAdded, members = [], currentUser, isAdmin }) {
  const [showForm, setShowForm] = useState(false);
  const [newLead, setNewLead] = useState({
    name: "",
    email: "",
    phone: "",
    assignedTo: isAdmin ? "" : currentUser.email,
    status: "New",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure assignedTo is filled
    const leadToAdd = { ...newLead, assignedTo: newLead.assignedTo || "POND" };

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

      const data = await res.json();
      onLeadAdded(data);
      setNewLead({ name: "", email: "", phone: "", assignedTo: isAdmin ? "" : currentUser.email, status: "New" });
      setShowForm(false);
    } catch (err) {
      console.error("Add lead error:", err);
      alert("Failed to add lead");
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
        <form className="add-lead-form" onSubmit={handleSubmit}>
          <div className="form-row">
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
          </div>
          <div className="form-row">
            <input
              type="text"
              placeholder="Phone"
              value={newLead.phone}
              onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
            />
          </div>
          {isAdmin && (
            <div className="form-row">
              <select
                value={newLead.assignedTo}
                onChange={(e) => setNewLead({ ...newLead, assignedTo: e.target.value })}
              >
                <option value="POND">Lead Pond</option>
                {members.map((m) => (
                  <option key={m.email} value={m.email}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="form-row">
            <select
              value={newLead.status}
              onChange={(e) => setNewLead({ ...newLead, status: e.target.value })}
            >
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Follow-up">Follow-up</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
          <button type="submit" className="submit-lead-btn">
            Add Lead
          </button>
        </form>
      )}
    </div>
  );
}
