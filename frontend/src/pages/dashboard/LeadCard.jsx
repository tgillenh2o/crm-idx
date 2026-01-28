import React, { useState } from "react";
import "./LeadCard.css";

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
  const [interactions, setInteractions] = useState(lead.interactions || []);
  const [interactionType, setInteractionType] = useState("call");
  const [interactionNote, setInteractionNote] = useState("");
  const [saving, setSaving] = useState(false);

  const assignedTo = lead.assignedTo || "UNASSIGNED";

  /* =========================
     STATUS COLORS
  ========================= */
  const statusColors = {
    New: "#60a5fa",
    Contacted: "#facc15",
    "Follow-up": "#fb923c",
    Closed: "#4ade80"
  };

  const assignedColors = {
    POND: "#38bdf8",
    UNASSIGNED: "#94a3b8"
  };

  /* =========================
     STATUS UPDATE
  ========================= */
  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);

    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/leads/${lead._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ status: newStatus })
      });
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  /* =========================
     ADD INTERACTION
  ========================= */
  const addInteraction = async () => {
    if (!interactionNote.trim()) return;
    setSaving(true);

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
      console.error("Interaction failed:", err);
    } finally {
      setSaving(false);
    }
  };

  /* =========================
     ASSIGNED LABEL
  ========================= */
  const assignedStyle = {
    background:
      assignedColors[assignedTo] ||
      "#c084fc",
  };

  return (
    <div className="lead-card">
      {/* HEADER */}
      <div className="lead-card-header">
        <h4>{lead.name}</h4>
        <span
          className="status-badge"
          style={{ background: statusColors[status] }}
        >
          {status}
        </span>
      </div>

      {/* BODY */}
      <div className="lead-card-body">
        <p>{lead.email}</p>
        <p>{lead.phone}</p>

        <span className="assigned-pill" style={assignedStyle}>
          {assignedTo === "POND" ? "Lead Pond" : assignedTo}
        </span>
      </div>

      {/* ACTIONS */}
      <div className="lead-card-actions">
        {/* STATUS */}
        <select value={status} onChange={handleStatusChange}>
          <option>New</option>
          <option>Contacted</option>
          <option>Follow-up</option>
          <option>Closed</option>
        </select>

        {/* ADMIN REASSIGN */}
        {isAdmin && onAssign && (
          <select
            value={assignedTo === "UNASSIGNED" ? "" : assignedTo}
            onChange={(e) => onAssign(lead._id, e.target.value)}
          >
            <option value="">Unassigned</option>
            <option value="POND">Lead Pond</option>
            {users.map((u) => (
              <option key={u._id} value={u.email}>
                {u.name}
              </option>
            ))}
          </select>
        )}

        {/* MEMBER CLAIM */}
        {isLeadPond && currentUserEmail && onAssign && !isAdmin && (
          <button
            className="primary"
            onClick={() => onAssign(lead._id, currentUserEmail)}
          >
            Claim
          </button>
        )}

        {/* ADMIN DELETE */}
        {isAdmin && onDelete && (
          <button className="danger" onClick={() => onDelete(lead._id)}>
            Delete
          </button>
        )}
      </div>

      {/* INTERACTIONS */}
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
          placeholder="Add interaction note..."
          value={interactionNote}
          onChange={(e) => setInteractionNote(e.target.value)}
        />

        <button
          className="secondary"
          disabled={saving}
          onClick={addInteraction}
        >
          Add
        </button>
      </div>

      {/* HISTORY */}
      <div className="interaction-history">
        {interactions.length === 0 ? (
          <p style={{ fontSize: "0.75rem", opacity: 0.6 }}>
            No interactions yet
          </p>
        ) : (
          interactions.map((i, idx) => (
            <div key={idx} className="interaction-item">
              <strong>{i.type}</strong> —{" "}
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
