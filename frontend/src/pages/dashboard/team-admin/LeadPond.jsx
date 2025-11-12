// src/pages/dashboard/team-admin/LeadPond.jsx
import React, { useEffect, useState } from "react";
import api from "../../../api";
import DashboardLayout from "../../../components/DashboardLayout";


export default function LeadPond() {
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    api.get("/leads/pond").then((res) => setLeads(res.data)).catch(console.error);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Lead Pond</h1>
      {leads.length === 0 ? (
        <p>No leads in pond.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {leads.map((lead) => (
            <div key={lead._id} className="bg-white p-4 rounded-lg shadow-md">
              <p className="font-bold">{lead.name}</p>
              <p>Email: {lead.email}</p>
              <p>Type: {lead.type}</p>
              <p>Assigned To: {lead.assignedTo?.name || "Unassigned"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
