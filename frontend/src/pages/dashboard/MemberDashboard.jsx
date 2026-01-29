import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import LeadCard from "./LeadCard";
import api from "../../api";
import "./Dashboard.css";

export default function MemberDashboard() {
  const { user } = useContext(AuthContext);
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await api.get("/leads");
      // Members only see their leads and pond
      const filtered = res.data.filter(
        (l) => l.assignedTo === user.email || !l.assignedTo || l.assignedTo === "POND"
      );
      setLeads(filtered);
    } catch (err) {
      console.error("Fetch leads error:", err);
    }
  };

  const claimLead = async (id) => {
    try {
      const res = await api.patch(`/leads/${id}/claim`);
      fetchLeads();
      setSelectedLead(res.data);
    } catch (err) {
      console.error("Claim failed:", err);
    }
  };

  const returnToPond = async (id) => {
    try {
      const res = await api.patch(`/leads/${id}/return`);
      fetchLeads();
      setSelectedLead(res.data);
    } catch (err) {
      console.error("Return failed:", err);
    }
  };

  const myLeads = leads.filter((l) => l.assignedTo === user.email);
  const leadPond = leads.filter((l) => !l.assignedTo || l.assignedTo === "POND");

  const renderList = (list) => (
    <div className="lead-list">
      {list.map((lead) => (
        <div
          key={lead._id}
          className={`lead-row status-${lead.status.replace(" ", "_").toLowerCase()}`}
          onClick={() => setSelectedLead(lead)}
        >
          <span>{lead.name}</span>
          <span>{lead.email}</span>
          <span>{lead.assignedTo || "POND"}</span>
          <span>{lead.status}</span>
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
  );

  return (
    <div className="dashboard">
      <div className="main-panel">
        <h2>My Leads & Lead Pond</h2>
        <h3>My Leads</h3>
        {renderList(myLeads)}

        <h3>Lead Pond</h3>
        {renderList(leadPond)}
      </div>

      {selectedLead && (
        <LeadCard
          lead={selectedLead}
          isAdmin={false}
          currentUserEmail={user.email}
          onUpdate={fetchLeads}
          onClose={() => setSelectedLead(null)}
        />
      )}
    </div>
  );
}
