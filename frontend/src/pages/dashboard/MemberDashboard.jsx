import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import LeadCard from "./LeadCard";
import AddLead from "./AddLead";
import Profile from "./Profile";
import "./Dashboard.css";

export default function MemberDashboard() {
  const { user } = useContext(AuthContext);
  const [leads, setLeads] = useState([]);
  const [activeTab, setActiveTab] = useState("my-leads");
  const [selectedLead, setSelectedLead] = useState(null);
  const [showAddLead, setShowAddLead] = useState(false);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leads`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    const data = await res.json();
    setLeads(data);
  };

  const updateLead = updatedLead => {
    setLeads(prev => prev.map(l => (l._id === updatedLead._id ? updatedLead : l)));
    setSelectedLead(updatedLead);
  };

  const addLead = lead => {
    // auto-assign new lead to current member
    lead.assignedTo = user.email;
    setLeads([lead, ...leads]);
    setShowAddLead(false);
  };

  // Filters
  const myLeads = leads.filter(l => l.assignedTo === user.email);
  const leadPond = leads.filter(l => !l.assignedTo || l.assignedTo === "POND");

  const counts = {
    "my-leads": myLeads.length,
    "lead-pond": leadPond.length
  };

  const renderList = list => (
    <div className="lead-list">
      {list.map(lead => (
        <div
          key={lead._id}
          className={`lead-row status-${lead.status.toLowerCase().replace(" ", "-")}`}
          onClick={() => setSelectedLead(lead)}
        >
          <span className="lead-name">{lead.name}</span>
          <span>{lead.email}</span>
          <span>{lead.assignedTo || "POND"}</span>
          <span>{lead.status}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="dashboard">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} counts={counts} />
      <div className="main-panel">
        <Topbar />

        {activeTab === "profile" && <Profile user={user} />}

        {activeTab === "my-leads" && (
          <>
            <button
              className="add-lead-btn"
              onClick={() => setShowAddLead(prev => !prev)}
            >
              {showAddLead ? "Close Lead Form" : "+ Add Lead"}
            </button>

            {showAddLead && <AddLead onLeadAdded={addLead} />}

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
          isAdmin={false}
          users={[]} // members can't reassign
          currentUserEmail={user.email}
          onUpdate={updateLead}
          onClose={() => setSelectedLead(null)}
        />
      )}
    </div>
  );
}
