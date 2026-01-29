import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import LeadCard from "./LeadCard";
import "./Dashboard.css";

export default function MemberDashboard() {
  const { user } = useContext(AuthContext);
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leads`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    const data = await res.json();
    setLeads(data.filter((l) => l.assignedTo === user.email || l.assignedTo === "POND"));
  };

  const claimLead = async (id) => {
    await fetch(`${import.meta.env.VITE_API_URL}/api/leads/${id}/claim`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    fetchLeads();
  };

  const returnToPond = async (id) => {
    await fetch(`${import.meta.env.VITE_API_URL}/api/leads/${id}/return`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    fetchLeads();
  };

  return (
    <div className="dashboard">
      <h2>My Leads & Pond</h2>
      <div className="lead-list">
        {leads.map((lead) => (
          <div
            key={lead._id}
            className={`lead-row status-${lead.status.toLowerCase().replace(/\s/g, "_")}`}
            onClick={() => setSelectedLead(lead)}
          >
            <span className="lead-name">{lead.name}</span>
            <span>{lead.email}</span>
            <span>{lead.assignedTo || "POND"}</span>

            <div className="actions" onClick={(e) => e.stopPropagation()}>
              {lead.assignedTo === "POND" && (
                <button className="claim-button" onClick={() => claimLead(lead._id)}>
                  Claim Lead
                </button>
              )}
              {lead.assignedTo === user.email && (
                <button className="return-button" onClick={() => returnToPond(lead._id)}>
                  Return to Pond
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedLead && (
        <LeadCard
          lead={selectedLead}
          currentUserEmail={user.email}
          onUpdate={(updated) => {
            setLeads((prev) => prev.map((l) => (l._id === updated._id ? updated : l)));
            setSelectedLead(updated);
          }}
          onClose={() => setSelectedLead(null)}
        />
      )}
    </div>
  );
}
