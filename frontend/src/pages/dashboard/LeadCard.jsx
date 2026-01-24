
import React, { useState } from "react";
import "./Dashboard.css";

export default function LeadCard({ lead, isAdmin = false, onDelete }) {
  const [status, setStatus] = useState(lead.status || "New");
  const [interactionType, setInteractionType] = useState("call");
  const [interactionNote, setInteractionNote] = useState("");
  const [interactions, setInteractions] = useState(lead.interactions || []);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    await fetch(`${import.meta.env.VITE_API_URL}/api/leads/${lead._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ status: newStatus }),
    });
  };

  const logInteraction = async () => {
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
      setInteractions(data.interactions);
      setInteractionNote(""); // reset input
    } catch (err) {
      console.error("Failed to log interaction:", err);
    }
  };

  return (
    <div className="lead-card">
      <div className="lead-info">
        <p><strong>Name:</strong> {lead.name}</p>
        <p><strong>Email:</strong> {lead.email}</p>
        <p><strong>Phone:</strong> {lead.phone}</p>
        <p><strong>Assigned To:</strong> {lead.assignedTo}</p>
        <p>
          <strong>Status:</strong>{" "}
          <select value={status} onChange={handleStatusChange}>
            <option>New</option>
            <option>Contacted</option>
            <option>Follow-up</option>
            <option>Closed</option>
          </select>
        </p>
      </div>

      {isAdmin && onDelete && (
        <button onClick={() => onDelete(lead._id)} className="delete-button">
          Delete Lead
        </button>
      )}

      {/* Log Interaction */}
      <div className="interaction-form">
        <select
          value={interactionType}
          onChange={(e) => setInteractionType(e.target.value)}
        >
          <option value="call">Call</option>
          <option value="email">Email</option>
          <option value="meeting">Meeting</option>
          <option value="note">Note</option>
        </select>
        <input
          type="text"
          placeholder="Add note..."
          value={interactionNote}
          onChange={(e) => setInteractionNote(e.target.value)}
        />
        <button onClick={logInteraction}>Add Interaction</button>
      </div>

      {/* Display Interaction History */}
      <div className="interaction-history">
        <h4>Interaction History</h4>
        {interactions.map((i, idx) => (
          <div key={idx} className="interaction-item">
            <strong>{i.type}</strong> by {i.createdBy} on{" "}
            {new Date(i.date).toLocaleString()} <br />
            {i.note}
          </div>
        ))}
      </div>
    </div>
  );
}

