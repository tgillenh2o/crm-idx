// src/components/LeadList.jsx
import React from "react";
import LeadCard from "./LeadCard";

const LeadList = ({ leads, onUpdateLead, onAssignLead }) => {
  return (
    <div>
      {leads.map((lead) => (
        <div key={lead._id}>
          <LeadCard lead={lead} onUpdate={onUpdateLead} />
          {onAssignLead && (
            <button
              onClick={() => onAssignLead(lead)}
              className="mt-1 px-2 py-1 bg-blue-600 text-white rounded"
            >
              Assign Lead
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default LeadList;
