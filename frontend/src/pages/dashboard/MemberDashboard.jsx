import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import LeadCard from "./LeadCard";
import Profile from "./Profile";
import "./Dashboard.css";

export default function MemberDashboard() {
  const { user } = useContext(AuthContext);
  const [leads, setLeads] = useState([]);
  const [activeTab, setActiveTab] = useState("my-leads");
  const [selectedLead, setSelectedLead] = useState(null);

  // Fetch leads for member
  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leads`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      setLeads(data);
    } catch (err) {
      console.error("Failed to fetch leads:", err);
    }
  };

  const updateLead = updatedLead => {
    setLeads(prev =>
      prev.map(l => (l._id === updatedLead._id ? updatedLead : l))
    );
    setSelectedLead(updatedLead);
  };

  // Filters
  const myLeads = leads.filter(l => l.assignedTo === user.email);
  const leadPond = leads.filter(l => !l.assignedTo || l.assignedTo === "POND");

  const renderList = list => (
    <div className="lead-list">
      {list.map(lead => {
        const statusClass = `status-${lead.status.toLowerCase().replace(/\s/g, "_")}`;
        return (
          <div
            key={lead._id}
            className={`lead-row ${statusClass}`}
            onClick={() => setSelectedLead(lead)}
          >
            <span className="lead-name">{lead.name}</span>
            <span>{lead.email}</span>
            <span>{lead.assignedTo || "POND"}</span>
            <span>{lead.status}</span>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="dashboard">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isAdmin={false} />
      <div className="main-panel">
        <Topbar />

        {activeTab === "profile" && <Profile user={user} />}

        {activeTab === "my-leads" && (
          <>
            <h3>My Leads</h3>
            {renderList(myLeads)}
          </>
        )}

        {activeTab === "lead-pond" && (
          <>
            <h3>Lead Pond</h3>
            {renderList(leadPond)}
          </>
        )}
      </div>

      {selectedLead && (
        <LeadCard
          lead={selectedLead}
          onUpdate={updateLead}
          onClose={() => setSelectedLead(null)}
          currentUserEmail={user.email}
          isAdmin={false} // members cannot reassign
          users={[]} // members do not need user list
        />
      )}
    </div>
  );
}
