import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./LeadCard.css";

export default function LeadCard({
  lead,
  isAdmin = false,
  isLeadPond = false,
  users = [],
  onAssign,
  onDelete
}) {
  const { user } = useContext(AuthContext);
  const [assigning, setAssigning] = useState(false);

  const assignedTo = lead.assignedTo || "UNASSIGNED";

  /* =========================
     STATUS COLOR LOGIC
  ========================= */
  const statusColors = {
    New: "#64b5f6",
    "Follow-up": "#ffb74d",
    Contacted: "#81c784",
    Closed: "#9575cd"
  };

  const statusColor = statusColors[lead.status] || "#90a4ae";

  /* =========================
     ASSIGNED-TO COLOR LOGIC
  ========================= */
  const getAssignedColor = (value) => {
    if (value === "POND" || value === "UNASSIGNED") return "#64b5f6";
    if (isAdmin) return "#f4c430"; // gold-ish for admin context

    // deterministic color for members
    const colors = ["#4db6ac", "#ba68c8", "#81c784", "#7986cb"];
    let hash = 0;
    for (let i = 0; i < value.length; i++) {
      hash = value.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  /* =========================
     ACTION HANDLERS
  ========================= */
  const handleAssignChange = async (e) => {
    const newValue = e.target.value;
    setAssigning(true);
    await onAssign(lead._id, newValue);
    setAssigning(false);
  };

  const handleClaim = async () => {
    await onAssign(lead._id, user.email);
  };

  const handleMoveToPond = async () => {
    await onAssign(lead._id, "POND");
  };

  const isMine = assignedTo === user?.email;

  /* =========================
     RENDER
  ========================= */
  return (
    <div className="lead-card">
      {/* HEADER */}
      <div className="lead-card-header">
        <h4>{lead.name}</h4>
        <span
          className="status-badge"
          style={{ backgroundColor: statusColor }}
        >
          {lead.status}
        </span>
      </div>

      {/* BODY */}
      <div className="lead-card-body">
        {lead.email && <p><strong>Email:</strong> {lead.email}</p>}
        {lead.phone && <p><strong>Phone:</strong> {lead.phone}</p>}

        <div
          className="assigned-pill"
          style={{ backgroundColor: getAssignedColor(assignedTo) }}
        >
          {assignedTo === "POND" || assignedTo === "UNASSIGNED"
            ? "Lead Pond"
            : assignedTo}
        </div>
      </div>

      {/* ACTIONS */}
      <div className="lead-card-actions">
        {/* ADMIN ACTIONS */}
        {isAdmin && (
          <>
            <select
              value={assignedTo}
              onChange={handleAssignChange}
              disabled={assigning}
            >
              <option value="POND">Lead Pond</option>
              {users.map((u) => (
                <option key={u._id} value={u.email}>
                  {u.name || u.email}
                </option>
              ))}
            </select>

            {onDelete && (
              <button
                className="danger"
                onClick={() => onDelete(lead._id)}
              >
                Delete
              </button>
            )}
          </>
        )}

        {/* MEMBER ACTIONS */}
        {!isAdmin && (
          <>
            {isLeadPond && (
              <button className="primary" onClick={handleClaim}>
                Claim Lead
              </button>
            )}

            {isMine && (
              <button className="secondary" onClick={handleMoveToPond}>
                Move to Pond
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
