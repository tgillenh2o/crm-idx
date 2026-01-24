import React, { useState } from "react";
import "./Dashboard.css";

export default function LeadCard({ lead, isAdmin = false, onDelete }) {
  const [status, setStatus] = useState(lead.status || "New");

  // Optional: update status handler (for both admin & member)
  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leads/${lead._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) console.error("Failed to update status", res.status);
    } catch (err) {
      console.error("Status update error:", err);
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
        <button
          className="delete-button"
          onClick={() => onDelete(lead._id)}
        >
          Delete Lead
        </button>
      )}
    </div>
  );
}
