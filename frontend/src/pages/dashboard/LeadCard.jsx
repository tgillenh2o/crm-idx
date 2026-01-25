import React, { useState } from "react";
import "./Dashboard.css";

export default function LeadCard({ lead, isAdmin = false, onDelete, users, onAssign }) {
  const [status, setStatus] = useState(lead.status || "New");
  const [interactionType, setInteractionType] = useState("call");
  const [interactionNote, setInteractionNote] = useState("");
  const [interactions, setInteractions] = useState(lead.interactions || []);

  // Update status
  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);

    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/leads/${lead._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  // Log interaction
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
          body: JSON.stringify({
            type: interactionType,
            note: interactionNote,
          }),
        }
      );
      const data = await res.json();
      setInteractions(data.interactions);
      setInteractionNote("");
    } catch (err) {
      console.error("Failed to log interaction:", err);
    }
  };

  // Safe Assigned To display
  const assignedToName = lead.assignedTo
    ? typeof lead.assignedTo === "string"
      ? lead.assignedTo === "POND"
        ? "Lead Pond"
        : lead.assignedTo
      : lead.assignedTo.name || "Unassigned"
    : "Unassigned";

  return (
    <div className="lead-card">
      <div className="lead-info">
        <p><strong>Name:</strong> {lead.name}</p>
        <p><strong>Email:</strong> {lead.email}</p>
        <p><strong>Phone:</strong> {lead.phone}</p>

        <p><strong>Assigned To:</strong> {assignedToName}</p>

        <p>
          <strong>Status:</strong>{" "}
          {isAdmin ? (
            <select value={status} onChange={handleStatusChange}>
              <option>New</option>
              <option>Contacted</option>
              <option>Follow-up</option>
              <option>Closed</option>
            </select>
          ) : (
            <span className={`status-badge status-${status.replace(" ", "-")}`}>
              {status}
            </span>
          )}
        </p>

        {isAdmin && users && users.length > 0 && (
          <p>
            <strong>Reassign Lead:</strong>{" "}
            <select
              value={lead.assignedTo?.id || ""}
              onChange={(e) => onAssign(lead._id, e.target.value)}
            >
              <option value="">Unassigned</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name}
                </option>
              ))}
            </select>
          </p>
        )}
      </div>

      {isAdmin && onDelete && (
        <button className="delete-button" onClick={() => onDelete(lead._id)}>
          Delete Lead
        </button>
      )}

      {/* Interaction Logger */}
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

      {/* Interaction History */}
      <div className="interaction-history">
        <h4>Interaction History</h4>
        {interactions.length > 0 ? (
          interactions.map((i, idx) => (
            <div key={idx} className="interaction-item">
              <strong>{i.type}</strong>{" "}
              {i.createdBy && <>by {i.createdBy}</>} on{" "}
              {new Date(i.date).toLocaleString()}
              <br />
              {i.note}
            </div>
          ))
        ) : (
          <p>No interactions yet.</p>
        )}
      </div>
    </div>
  );
}
