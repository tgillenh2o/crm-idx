import React, { useState } from "react";
import "./LeadCard.css";

export default function LeadCard({ lead, isAdmin, users, currentUserEmail, onUpdate, onClose }) {
  const [editableLead, setEditableLead] = useState({ ...lead });
  const [editing, setEditing] = useState(false);

  // Handle input changes
  const handleChange = e => {
    setEditableLead({ ...editableLead, [e.target.name]: e.target.value });
  };

  // Save edits
  const handleSave = () => {
    onUpdate(editableLead);
    setEditing(false);
  };

  // Claim lead from Pond
  const handleClaim = () => {
    const updated = { ...editableLead, assignedTo: currentUserEmail };
    onUpdate(updated);
  };

  // Admin reassign
  const handleReassign = newEmail => {
    const updated = { ...editableLead, assignedTo: newEmail };
    onUpdate(updated);
  };

  // Status color mapping
  const statusColor = status => {
    switch (status.toLowerCase()) {
      case "new":
        return "#f0ad4e"; // orange
      case "contacted":
        return "#5bc0de"; // blue
      case "follow-up":
        return "#9370DB"; // purple
      case "under contract":
        return "#20c997"; // teal
      case "closed":
        return "#5cb85c"; // green
      default:
        return "#ccc";
    }
  };

  return (
    <div className={`lead-card status-${editableLead.status.toLowerCase().replace(" ", "-")}`}>
      {/* Close button */}
      <button className="close-button" onClick={onClose}>×</button>

      {/* Lead name with status color */}
      <h3 className="lead-name" style={{ color: statusColor(editableLead.status) }}>
        {editableLead.name}
      </h3>

      {/* Editable form */}
      {editing ? (
        <div className="lead-edit-form">
          <label>
            Name: <input name="name" value={editableLead.name} onChange={handleChange} />
          </label>
          <label>
            Email: <input name="email" value={editableLead.email} onChange={handleChange} />
          </label>
          <label>
            Phone: <input name="phone" value={editableLead.phone} onChange={handleChange} />
          </label>
          <label>
            Status:
            <select name="status" value={editableLead.status} onChange={handleChange}>
              <option>New</option>
              <option>Contacted</option>
              <option>Follow-Up</option>
              <option>Under Contract</option>
              <option>Closed</option>
            </select>
          </label>
          <div className="form-buttons">
            <button className="claim-button" onClick={handleSave}>Save</button>
            <button className="return-button" onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <div className="lead-details">
          <p><strong>Email:</strong> {editableLead.email}</p>
          <p><strong>Phone:</strong> {editableLead.phone}</p>
          <p><strong>Status:</strong> {editableLead.status}</p>
          <p><strong>Assigned To:</strong> {editableLead.assignedTo || "POND"}</p>

          {/* Claim from Pond button for members */}
          {!isAdmin && (!editableLead.assignedTo || editableLead.assignedTo === "POND") && (
            <button className="claim-button" onClick={handleClaim}>Claim from Pond</button>
          )}

          {/* Reassign & edit for admin */}
          {isAdmin && (
            <div className="admin-actions">
              <label>
                Reassign:
                <select
                  value={editableLead.assignedTo || ""}
                  onChange={e => handleReassign(e.target.value)}
                >
                  <option value="">POND</option>
                  {users.map(u => (
                    <option key={u.email} value={u.email}>
                      {u.name} ({u.email})
                    </option>
                  ))}
                </select>
              </label>
              <button className="close-button" onClick={() => setEditing(true)}>Edit Lead</button>
            </div>
          )}
        </div>
      )}

      {/* Interactions / notes */}
      <div className="interaction-history">
        <h4>Interactions</h4>
        {editableLead.interactions?.length > 0 ? (
          editableLead.interactions.map((note, idx) => (
            <div key={idx} className="interaction-item">
              <strong>{note.author || "User"}:</strong> {note.text || note}
            </div>
          ))
        ) : (
          <p>No interactions yet.</p>
        )}
      </div>
    </div>
  );
}
