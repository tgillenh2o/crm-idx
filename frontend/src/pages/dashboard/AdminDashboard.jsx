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

  // Fetch leads and users
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
      setLeads(data);
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
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  // Update lead in local state
  const updateLead = updatedLead => {
    setLeads(prev =>
      prev.map(l => (l._id === updatedLead._id ? updatedLead : l))
    );
    setSelectedLead(updatedLead);
  };

  // Filter leads
  const allLeads = leads;
  const myLeads = leads.filter(l => l.assignedTo === user.email);
  const leadPond = leads.filter(l => !l.assignedTo || l.assignedTo === "POND");

  // Render lead list
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
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isAdmin={user.role === "teamAdmin"} />
      <div className="main-panel">
        <Topbar />

        {activeTab === "profile" && <Profile user={user} />}

        {activeTab === "all-leads" && (
          <>
            <button className="add-lead-btn" onClick={() => setShowAddLead(prev => !prev)}>
              {showAddLead ? "Close Lead Form" : "+ Add Lead"}
            </button>

            {showAddLead && (
              <AddLead
                isAdmin={user.role === "teamAdmin"}
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
          onUpdate={updateLead}
          onClose={() => setSelectedLead(null)}
          currentUserEmail={user.email}
          isAdmin={user.role === "teamAdmin"}
          users={users}
        />
      )}
    </div>
  );
}
