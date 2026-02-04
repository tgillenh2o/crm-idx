import React, { useEffect, useState } from "react";
import "./LeadCard.css";

export default function LeadCard({
  lead,
  isAdmin,
  users = [],
  currentUserEmail,
  onUpdate,
  onClose,
  onDelete,
}) {
  const [localLead, setLocalLead] = useState({ ...lead });
  const [editing, setEditing] = useState(false);
  const [newInteraction, setNewInteraction] = useState("");
  const [flash, setFlash] = useState("");

  /* ================= SYNC ================= */
  useEffect(() => {
    setLocalLead({ ...lead });
  }, [lead]);

  const triggerFlash = () => {
    setFlash(isAdmin ? "flash-admin" : "flash-member");
    setTimeout(() => setFlash(""), 700);
  };

  /* ================= API SAVE ================= */
const saveLead = async (changes) => {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/api/leads/${lead._id}`,
    {
      method: "PATCH", // 🔥 THIS WAS THE BUG
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(changes),
    }
  );

  if (!res.ok) {
    console.error("Save failed");
    return;
  }

  const saved = await res.json();
  setLocalLead(saved);
  onUpdate(saved); // syncs dashboard
  triggerFlash();
};



  /* ================= ACTIONS ================= */
const handleStatusChange = e => {
  const newStatus = e.target.value || "New";

  setLocalLead(prev => ({
    ...prev,
    status: newStatus,
  }));

  saveLead({ status: newStatus });
};



  const handleChange = e =>
    setLocalLead({ ...localLead, [e.target.name]: e.target.value });

  const handleSave = () => {
  saveLead({
    name: localLead.name,
    email: localLead.email,
    phone: localLead.phone,
    status: localLead.status || "New",
  });
  setEditing(false);
};


 const handleClaim = e => {
  e.stopPropagation();
  saveLead({ assignedTo: currentUserEmail });
};


const handleReturnToPond = e => {
  e.stopPropagation();
  saveLead({ assignedTo: "" });
};


const handleReassign = (e, email) => {
  e.stopPropagation();
  saveLead({ assignedTo: email });
};


 const handleDelete = async () => {
  if (!window.confirm("Delete this lead?")) return;

  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/api/leads/${lead._id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  if (!res.ok) {
    alert("Delete failed");
    return;
  }

  onDelete(lead._id); // 🔥 THIS was crashing before
  onClose();
};


const handleAddInteraction = async () => {
  if (!newInteraction.trim()) return;

  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/api/leads/${lead._id}/interactions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        note: newInteraction,
        type: "note",
      }),
    }
  );

  if (!res.ok) {
    console.error("Interaction failed");
    return;
  }

  const data = await res.json();

  const updatedLead = {
    ...localLead,
    interactions: data.interactions,
  };

  setLocalLead(updatedLead);
  onUpdate(updatedLead); // keeps dashboard in sync
  setNewInteraction("");
};



  /* ================= PERMISSIONS ================= */
  const memberCanEdit =
    !isAdmin && (localLead.assignedTo === currentUserEmail);
  const canEdit = isAdmin || memberCanEdit;

  const statusClass = (localLead.status || "New")
    .toLowerCase()
    .replace(" ", "-");

  /* ================= RENDER ================= */
  return (
    <div className="lead-modal">
      <div className={`lead-card status-${statusClass} ${flash}`}>
        <button className="close-button" onClick={onClose}>×</button>

        <h3>{localLead.name}</h3>

        {/* EDIT MODE */}
        {editing && canEdit ? (
          <div className="lead-edit-form">
            <input name="name" value={localLead.name} onChange={handleChange} />
            <input name="email" value={localLead.email} onChange={handleChange} />
            <input name="phone" value={localLead.phone || ""} onChange={handleChange} />

            <select value={localLead.status || "New"} onChange={handleStatusChange}>
              <option>New</option>
              <option>Contacted</option>
              <option>Follow-Up</option>
              <option>Under Contract</option>
              <option>Closed</option>
            </select>

            <div className="form-buttons">
              <button className="claim-button" onClick={handleSave}>Save</button>
              <button className="return-button" onClick={() => setEditing(false)}>
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* VIEW MODE */}
            <p><strong>Email:</strong> {localLead.email}</p>
            <p><strong>Phone:</strong> {localLead.phone}</p>
            <p><strong>Status:</strong> {localLead.status || "New"}</p>
            <p><strong>Assigned:</strong> {localLead.assignedTo || "POND"}</p>

            {canEdit && (
              <button className="close-button" onClick={() => setEditing(true)}>
                Edit Lead
              </button>
            )}

            {canEdit && localLead.assignedTo && (
              <button className="return-button" onClick={handleReturnToPond}>
                Return to Pond
              </button>
            )}

            {!isAdmin && (!localLead.assignedTo || localLead.assignedTo === "POND") && (
              <button className="claim-button" onClick={handleClaim}>
                Claim from Pond
              </button>
            )}

            {isAdmin && (
              <div className="admin-actions">
                <select
                  value={localLead.assignedTo || ""}
                  onChange={e => handleReassign(e, e.target.value)}
                >
                  <option value="">POND</option>
                  {users.map(u => (
                    <option key={u.email} value={u.email}>
                      {u.name} ({u.email})
                    </option>
                  ))}
                </select>

           <button
  className="delete-button"
  onClick={handleDelete}
>
  Delete Lead
</button>


              </div>
            )}
          </>
        )}

        {/* INTERACTIONS */}
        <div className="interaction-history">
          <h4>Interactions</h4>

          {(localLead.interactions || []).length ? (
            localLead.interactions.map((i, idx) => (
              <div key={idx} className="interaction-item">
                <strong>{i.createdBy}:</strong> {i.note}
              </div>
            ))
          ) : (
            <p>No interactions yet.</p>
          )}

          {canEdit && (
            <div className="interaction-form">
              <input
                value={newInteraction}
                onChange={e => setNewInteraction(e.target.value)}
                placeholder="Add interaction..."
              />
              <button onClick={handleAddInteraction}>Add</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
