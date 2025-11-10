// src/components/LeadCard.jsx
import React from "react";

const LeadCard = ({ lead, onUpdate }) => {
  const handleTypeChange = (e) => {
    onUpdate({ ...lead, type: e.target.value });
  };

  return (
    <div className="border p-4 rounded mb-2 shadow-sm">
      <h3 className="font-bold">{lead.firstName} {lead.lastName}</h3>
      <p>Email: {lead.email}</p>
      <p>Phone: {lead.phone}</p>
      <label>
        Type:
        <select value={lead.type} onChange={handleTypeChange} className="ml-2 border rounded px-1">
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
        </select>
      </label>
      <p>Status: {lead.status}</p>
    </div>
  );
};

export default LeadCard;
