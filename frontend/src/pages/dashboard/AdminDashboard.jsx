import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import LeadCard from "./LeadCard";
import AddLead from "./AddLead";
import Profile from "./Profile";
import "./Dashboard.css";

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const [leads, setLeads] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("all-leads");
  const [selectedLead, setSelectedLead] = useState(null);
  const [showAddLead, setShowAddLead] = useState(false);

  // Fetch leads and users on mount
  useEffect(() => {
    fetchLeads();
    fetchUsers();
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

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  // Update lead in state (dashboard + modal)
  const updateLead = updatedLead => {
    setLeads(prev =>
      prev.map(l => (l._id === updatedLead._id ? updatedLead : l))
    );
    setSelectedLead(updatedLead);
  };

  const allLeads = leads;
  const leadPond = leads.filter(l => !l.assignedTo || l.assignedTo === "POND");
  const myLeads = leads.filter(l => l.assignedTo === user.email);

  // Render lead list rows
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
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isAdmin />
      <div className="main-panel">
        <Topbar />

        {activeTab === "profile" && <Profile user={user} />}

        {activeTab === "all-leads" && (
          <>
            <button
              className="add-lead-btn"
              onClick={() => setShowAddLead(prev => !prev)}
            >
              {showAddLead ? "Close Lead Form" : "+ Add Lead"}
            </button>

            {showAddLead && (
              <AddLead
                isAdmin
                onLeadAdded={lead => {
                  setLeads([lead, ...leads]);
                  setShowAddLead(false);
                }}
              />
            )}

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
            <h3>My Leads</h3>
            {renderList(myLeads)}
          </>
        )}
      </div>

      {selectedLead && (
        <LeadCard
          lead={selectedLead}
          isAdmin
          users={users}
          currentUserEmail={user.email}
          onUpdate={updateLead}
          onClose={() => setSelectedLead(null)}
        />
      )}
    </div>
  );
}
