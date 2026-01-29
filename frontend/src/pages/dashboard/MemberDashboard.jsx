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
    const allLeads = await res.json();
    setLeads(
      allLeads.filter(
        l => l.assignedTo === user.email || l.assignedTo === "POND"
      )
    );
  };

  const updateLead = updatedLead => {
    setLeads(prev =>
      prev.map(l => (l._id === updatedLead._id ? updatedLead : l))
    );
    setSelectedLead(updatedLead);
  };

  return (
    <div className="dashboard">
      <div className="main-panel">
        <h2>My Leads & Lead Pond</h2>

        <div className="lead-list">
          {leads.map(lead => (
            <div
              key={lead._id}
              className={`lead-row status-${lead.status.toLowerCase().replace(" ", "_")}`}
              onClick={() => setSelectedLead(lead)}
            >
              <span className="lead-name">{lead.name}</span>
              <span>{lead.email}</span>
              <span>{lead.assignedTo || "POND"}</span>
            </div>
          ))}
        </div>

        {selectedLead && (
          <LeadCard
            lead={selectedLead}
            currentUserEmail={user.email}
            onUpdate={updateLead}
            onClose={() => setSelectedLead(null)}
          />
        )}
      </div>
    </div>
  );
}
