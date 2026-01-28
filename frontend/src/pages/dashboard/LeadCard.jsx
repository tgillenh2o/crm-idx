import React, { useState } from "react";
import "./Dashboard.css";

export default function LeadCard({
  lead,
  isAdmin = false,
  onDelete,
  onAssign,
  users = [],
  isLeadPond = false,
  currentUserEmail
}) {
  const [status, setStatus] = useState(lead.status || "New");
  const [assignedTo, setAssignedTo] = useState(lead.assignedTo || "");
  const [interactionType, setInteractionType] = useState("call");
  const [interactionNote, setInteractionNote] = useState("");
  const [interactions, setInteractions] = useState(lead.interactions || []);
  const [removing, setRemoving] = useState(false);

  const assignedToName = assignedTo || "Unassigned";

  // 🔹 Status color mapping (robust, lowercase-safe)
  const statusColors = {
    new: "#38bdf8",
    contacted: "#facc15",
    "follow-up": "#fb923c",
    closed: "#4ade80"
  };

  // ================= STATUS UPDATE =================
  const handleStatusChange = async e => {
    const newStatus = e.target.value;
    setStatus(newStatus);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/leads/${lead._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
          },
          body: JSON.stringify({ status: newStatus })
        }
      );

      const updated = await res.json();
      setStatus(updated.status || newStatus);
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  // ================= REASSIGN =================
  const handleAssign = value => {
    setAssignedTo(value);          // instant UI update
    onAssign && onAssign(lead._id, value);
  };

  // ================= INTERACTIONS =================
  const handleInteraction = async () => {
    if (!interactionNote.trim()) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/leads/${lead._id}/interactions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
          },
          body: JSON.stringify({
            type: interactionType,
            note: interactionNote
          })
        }
      );

      const data = await res.json();
      setInteractions(data.interactions || []);
      setInteractionNote("");
    } catch (err) {
      console.error("Failed to log interaction:", err);
    }
  };

  return (
    <div className={`lead-card ${isLeadPond ? "lead-pond" : ""} ${removing ? "removing" : ""}`}>
      {/* ================= LEAD INFO ================= */}
      <div className="lead-info">
        <p><strong>Name:</strong> {lead.name}</p>
        <p><strong>Email:</strong> {lead.email}</p>
        <p><strong>Phone:</strong> {lead.phone || "—"}</p>

        {/* Assigned To */}
        <p>
          <strong>Assigned To:</strong>{" "}
          <span
            style={{
              color:
                assignedTo === currentUserEmail
                  ? "#4ade80"
                  : assignedTo === "POND"
                  ? "#38bdf8"
                  : "#94a3b8",
              fontWeight: 600
            }}
          >
            {assignedToName}
          </span>
        </p>

        {/* Status */}
        <p>
          <strong>Status:</strong>{" "}
          <span
            className="status-badge"
            style={{
              background:
                statusColors[status.toLowerCase()] || "#64748b"
            }}
          >
            {status}
          </span>

          <select value={status} onChange={handleStatusChange}>
            <option>New</option>
            <option>Contacted</option>
            <option>Follow-up</option>
            <option>Closed</option>
          </select>
        </p>

        {/* Reassign */}
        {isAdmin && onAssign && users.length > 0 && (
          <p>
            <strong>Reassign:</strong>{" "}
            <select
              value={assignedTo}
              onChange={e => handleAssign(e.target.value)}
            >
              <option value="">Unassigned</option>
              <option value="POND">Lead Pond</option>
              {users.map(u => (
                <option key={u._id} value={u.email}>
                  {u.name}
                </option>
              ))}
            </select>
          </p>
        )}
      </div>

      {/* ================= LEAD POND CLAIM ================= */}
      {isLeadPond && onAssign && currentUserEmail && (
        <button
          className="claim-button"
          onClick={() => {
            setRemoving(true);
            setTimeout(() => handleAssign(currentUserEmail), 300);
          }}
        >
          Claim Lead
        </button>
      )}

      {/* ================= DELETE ================= */}
      {isAdmin && onDelete && (
        <button
          className="delete-button"
          onClick={() => onDelete(lead._id)}
        >
          Delete Lead
        </button>
      )}

      {/* ================= INTERACTION FORM ================= */}
      <div className="interaction-form">
        <select
          value={interactionType}
          onChange={e => setInteractionType(e.target.value)}
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
          onChange={e => setInteractionNote(e.target.value)}
        />

        <button onClick={handleInteraction}>
          Add Interaction
        </button>
      </div>

      {/* ================= INTERACTION HISTORY ================= */}
      <div className="interaction-history">
        <h4>Interaction History</h4>

        {interactions.length === 0 ? (
          <p>No interactions yet</p>
        ) : (
          interactions.map((i, idx) => (
            <div key={idx} className="interaction-item">
              <strong>{i.type}</strong>{" "}
              by {i.createdBy || "Unknown"} on{" "}
              {new Date(i.date).toLocaleString()}
              <br />
              {i.note}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
