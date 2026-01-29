import React, { useState } from "react";
import "./LeadCard.css";

export default function LeadCard({
  lead,
  onUpdate,
  onClose,
  isAdmin,
  currentUserEmail,
  showReassign,
  users = [],
  claimLead,
  returnToPond,
  addInteraction,
}) {
  const [status, setStatus] = useState(lead.status);
  const [editableLead, setEditableLead] = useState({
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    assignedTo: lead.assignedTo,
  });
  const [interactionType, setInteractionType] = useState("note");
  const [interactionNote, setInteractionNote] = useState("");

  const saveStatus = async (newStatus) => {
    setStatus(newStatus);
    const updatedLead = { ...lead, status: newStatus };
    onUpdate(updatedLead);

    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/leads/${lead._id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  const handleLeadChange = (field, value) => {
    setEditableLead((prev) => ({ ...prev, [field]: value }));
  };

  const saveLeadDetails = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leads/${lead._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(editableLead),
      });
      const updated = await res.json();
      onUpdate(updated);
    } catch (err) {
      console.error("Lead update failed:", err);
    }
  };

  const handleAddInteraction = async () => {
    if (!interactionNote.trim()) return;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/leads/${lead._id}/interactions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ type: interactionType, note: interactionNote }),
        }
      );
      const data = await res.json();
      addInteraction(data.interactions);
      setInteractionNote("");
    } catch (err) {
      console.error("Add interaction failed:", err);
    }
  };

  return (
    <div className="lead-modal">
      <div className={`lead-card status-${status.toLowerCase().replace(" ", "_")}`}>
        <h2>Lead Details</h2>

        <label>Name</label>
        <input
          value={editableLead.name}
          onChange={(e) => handleLeadChange("name", e.target.value)}
        />

        <label>Email</label>
        <input
          value={editableLead.email}
          onChange={(e) => handleLeadChange("email", e.target.value)}
        />

        <label>Phone</label>
        <input
          value={editableLead.phone}
          onChange={(e) => handleLeadChange("phone", e.target.value)}
        />

        <label>Status</label>
        <select
          value={status}
          onChange={(e) => saveStatus(e.target.value)}
        >
          <option>New</option>
          <option>Contacted</option>
          <option>Follow-up</option>
          <option>Under Contract</option>
          <option>Closed</option>
        </select>

        {showReassign && (
          <>
            <label>Reassign To</label>
            <select
              value={editableLead.assignedTo}
              onChange={(e) => handleLeadChange("assignedTo", e.target.value)}
            >
              <option value="POND">POND</option>
              {users.map((u) => (
                <option key={u.email} value={u.email}>
                  {u.name || u.email}
                </option>
              ))}
            </select>
          </>
        )}

        <button onClick={saveLeadDetails} className="save-btn">
          Save Details
        </button>

        {(lead.assignedTo === "POND" || lead.assignedTo !== currentUserEmail) && (
          <div className="lead-buttons">
            {lead.assignedTo === "POND" && (
              <button onClick={() => claimLead(lead._id)}>Claim Lead</button>
            )}
            {lead.assignedTo === currentUserEmail && (
              <button onClick={() => returnToPond(lead._id)}>Return to Pond</button>
            )}
          </div>
        )}

        <div className="interaction-section">
          <h4>Interactions</h4>
          <div className="interaction-history">
            {lead.interactions?.map((i, idx) => (
              <div key={idx} className="interaction-item">
                <strong>{i.type}</strong> by {i.createdBy} on {new Date(i.date).toLocaleString()}
                <div>{i.note}</div>
              </div>
            ))}
          </div>
          <div className="interaction-form">
            <select
              value={interactionType}
              onChange={(e) => setInteractionType(e.target.value)}
            >
              <option value="note">Note</option>
              <option value="call">Call</option>
              <option value="email">Email</option>
              <option value="meeting">Meeting</option>
            </select>
            <input
              value={interactionNote}
              placeholder="Add interaction..."
              onChange={(e) => setInteractionNote(e.target.value)}
            />
            <button onClick={handleAddInteraction}>Add</button>
          </div>
        </div>

        <button className="close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
