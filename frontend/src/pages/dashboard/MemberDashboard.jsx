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
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leads`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      setLeads(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch leads:", err);
    }
  };

  // Update lead in dashboard and modal
  const updateLead = updatedLead => {
    setLeads(prev =>
      prev.map(l => (l._id === updatedLead._id ? updatedLead : l))
    );
    setSelectedLead(updatedLead);
  };

  const myLeads = leads.filter(l => l.assignedTo === user.email);
  const allLeads = leads;
  const leadPond = leads.filter(l => !l.assignedTo || l.assignedTo === "POND");

  // Render clickable lead rows
  const renderList = list => (
    <div className="lead-list">
      {list.map(lead => {
        const statusClass = lead.status ? lead.status.toLowerCase().replace(" ", "-") : "new";
        return (
          <div
            key={lead._id}
            className={`lead-row status-${statusClass}`}
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
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="main-panel">
        <Topbar />

        {activeTab === "profile" && <Profile user={user} />}

        {activeTab === "all-leads" && (
          <>
            <h3>All Leads</h3>
            {renderList(allLeads)}
          </>
        )}

        {activeTab === "lead-pond" && (
          <>
            <h3>Lead Pond</h3>
            {renderList(leadPond)}
          </>
        )}

        {activeTab === "my-leads" && (
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
                  // Auto-assign to current member
                  const assignedLead = { ...lead, assignedTo: user.email, status: "New" };
                  setLeads([assignedLead, ...leads]);
                  setShowAddLead(false);
                }}
              />
            )}

            <h3>My Leads</h3>
            {renderList(myLeads)}
          </>
        )}
      </div>

      {selectedLead && (
        <LeadCard
          lead={selectedLead}
          isAdmin={false}
          users={[]} // members don't reassign
          currentUserEmail={user.email}
          onUpdate={updateLead}
          onClose={() => setSelectedLead(null)}
        />
      )}
    </div>
  );
}
