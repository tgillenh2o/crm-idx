import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import LeadCard from "./LeadCard";
import AddLead from "./AddLead";
import Profile from "./Profile";
import "./Dashboard.css";

const STATUS_COLORS = {
  New: "#4caf50",
  Contacted: "#2196f3",
  "Follow-Up": "#ff9800",
  "Under Contract": "#9c27b0",
  Closed: "#f44336",
};

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const [leads, setLeads] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedLead, setSelectedLead] = useState(null);
  const [showAddLead, setShowAddLead] = useState(false);

  useEffect(() => {
    fetchLeads();
    fetchUsers();
  }, []);

  const fetchLeads = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leads`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setLeads(await res.json());
  };

  const fetchUsers = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setUsers(await res.json());
  };

  const updateLead = updatedLead => {
    setLeads(prev => prev.map(l => (l._id === updatedLead._id ? updatedLead : l)));
    setSelectedLead(updatedLead);
  };

  const allLeads = leads;
  const leadPond = leads.filter(l => !l.assignedTo || l.assignedTo === "POND");

  const renderList = list => (
    <div className="lead-list">
      {list.map(lead => (
        <div
          key={lead._id}
          className={`lead-row status-${(lead.status || "New").toLowerCase().replace(" ", "-")}`}
          onClick={() => setSelectedLead(lead)}
          style={{ cursor: "pointer" }}
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
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isAdmin={true} />
      <div className="main-panel">
        <Topbar />

        {activeTab === "dashboard" && (
          <DashboardStats leads={leads} isAdmin={true} />
        )}

        {activeTab === "profile" && <Profile user={user} />}

        {activeTab === "all-leads" && (
          <>
            <button className="add-lead-btn" onClick={() => setShowAddLead(prev => !prev)}>
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
      </div>

      {selectedLead && (
        <LeadCard
          lead={selectedLead}
          isAdmin={true}
          users={users}
          currentUserEmail={user.email}
          onUpdate={updateLead}
          onClose={() => setSelectedLead(null)}
        />
      )}
    </div>
  );
}

function DashboardStats({ leads, isAdmin }) {
  const totalLeads = leads.length;
  const statusCounts = {
    New: 0,
    Contacted: 0,
    "Follow-Up": 0,
    "Under Contract": 0,
    Closed: 0
  };

  leads.forEach(l => {
    const status = l.status || "New";
    if (statusCounts[status] !== undefined) statusCounts[status]++;
  });

  return (
    <div className="dashboard-stats">
      <h2>Admin Dashboard</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Leads</h3>
          <p>{totalLeads}</p>
        </div>
        {Object.entries(statusCounts).map(([status, count]) => (
          <div key={status} className="stat-card" style={{ borderTop: `4px solid ${STATUS_COLORS[status]}` }}>
            <h3>{status}</h3>
            <p>{count}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
