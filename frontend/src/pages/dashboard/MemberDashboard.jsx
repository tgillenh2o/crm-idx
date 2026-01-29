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
  const [activeTab, setActiveTab] = useState("lead-pond");
  const [selectedLead, setSelectedLead] = useState(null);
  const [showAddLead, setShowAddLead] = useState(false);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leads`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await res.json();
    setLeads(Array.isArray(data) ? data : []);
  };

  const updateLead = updatedLead => {
    setLeads(prev =>
      prev.map(l => (l._id === updatedLead._id ? updatedLead : l))
    );
    setSelectedLead(updatedLead);
  };

  const leadPond = leads.filter(
    l =>
      !l.assignedTo ||
      l.assignedTo === "POND" ||
      l.assignedTo === "UNASSIGNED"
  );

  const myLeads = leads.filter(l => l.assignedTo === user.email);

  const renderList = list => (
    <div className="lead-list">
      {list.map(lead => (
        <div
          key={lead._id}
          className={`lead-row status-${lead.status.toLowerCase()}`}
          onClick={() => setSelectedLead(lead)}
        >
          <span className="lead-name">{lead.name}</span>
          <span>{lead.email}</span>
          <span>{lead.phone}</span>
          <span>{lead.status}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="dashboard">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="main-panel">
        <Topbar />

        {activeTab === "profile" && <Profile user={user} />}

        {activeTab === "lead-pond" && (
          <>
            <button
              className="add-lead-btn"
              onClick={() => setShowAddLead(prev => !prev)}
            >
              {showAddLead ? "Close Lead Form" : "+ Add Lead"}
            </button>

            {showAddLead && (
              <AddLead
                onLeadAdded={lead => {
                  setLeads([lead, ...leads]);
                  setShowAddLead(false);
                }}
              />
            )}

            <h3>Lead Pond</h3>
            {renderList(leadPond)}
          </>
        )}

        {activeTab === "my-leads" && (
          <>
            <h3>My Leads</h3>
            {renderList(myLeads)}
          </>
        )}
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
  );
}
