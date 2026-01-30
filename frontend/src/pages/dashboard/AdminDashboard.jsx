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
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    fetchLeads();
    fetchUsers();
  }, []);

  // ---------- API ----------
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

  const updateLead = updated => {
    setLeads(prev => prev.map(l => (l._id === updated._id ? updated : l)));
    setSelectedLead(updated);
  };

  const claimLead = async lead => {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/leads/${lead._id}/assign`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ assignedTo: user.email }),
      }
    );

    updateLead(await res.json());
  };

  // ---------- Filters ----------
  const myLeads = leads.filter(l => l.assignedTo === user.email);
  const leadPond = leads.filter(l => !l.assignedTo || l.assignedTo === "POND");

  const allLeads = filterStatus
    ? leads.filter(l => l.status === filterStatus)
    : leads;

  // ---------- Render List ----------
  const renderList = list => (
    <div className="lead-list">
      {list.map(lead => (
        <div
          key={lead._id}
          className="lead-row"
          onClick={() => setSelectedLead(lead)}
        >
          <span className="lead-name">{lead.name}</span>
          <span>{lead.email}</span>
          <span>{lead.assignedTo || "POND"}</span>
          <span>{lead.status || "New"}</span>

          {!lead.assignedTo && (
            <button
              className="claim-button"
              onClick={e => {
                e.stopPropagation();
                claimLead(lead);
              }}
            >
              Claim
            </button>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="dashboard">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isAdmin
      />

      <div className="main-panel">
        <Topbar />

        {activeTab === "dashboard" && (
          <DashboardStats
            leads={leads}
            users={users}
            onFilter={setFilterStatus}
            activeFilter={filterStatus}
          />
        )}

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

        {activeTab === "all-leads" && (
          <>
            <button
              className="add-lead-btn"
              onClick={() => setShowAddLead(p => !p)}
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

        {activeTab === "profile" && <Profile user={user} />}
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

/* ================= DASHBOARD STATS ================= */

function DashboardStats({ leads, users, onFilter, activeFilter }) {
  const statusCounts = {
    New: 0,
    Contacted: 0,
    "Follow-Up": 0,
    "Under Contract": 0,
    Closed: 0,
  };

  leads.forEach(l => {
    const s = l.status || "New";
    if (statusCounts[s] !== undefined) statusCounts[s]++;
  });

  // ----- Stats per agent -----
  const agentStats = {};
  leads.forEach(l => {
    if (!l.assignedTo) return;
    agentStats[l.assignedTo] = (agentStats[l.assignedTo] || 0) + 1;
  });

  return (
    <div className="dashboard-stats">
      <h2>Admin Dashboard</h2>

      <div className="stats-grid">
        <div
          className={`stat-card ${activeFilter === "" ? "active-filter" : ""}`}
          onClick={() => onFilter("")}
        >
          <h3>Total Leads</h3>
          <p>{leads.length}</p>
        </div>

        {Object.entries(statusCounts).map(([status, count]) => (
          <div
            key={status}
            className={`stat-card ${activeFilter === status ? "active-filter" : ""}`}
            style={{ borderTop: `4px solid ${STATUS_COLORS[status]}` }}
            onClick={() => onFilter(status)}
          >
            <h3>{status}</h3>
            <p>{count}</p>
          </div>
        ))}
      </div>

      <h3 style={{ marginTop: 30 }}>Leads Per Agent</h3>
      <div className="stats-grid">
        {Object.entries(agentStats).map(([email, count]) => (
          <div key={email} className="stat-card">
            <h4>{email}</h4>
            <p>{count}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
