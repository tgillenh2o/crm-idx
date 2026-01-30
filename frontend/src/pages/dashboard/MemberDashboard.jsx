import React, { useContext, useEffect, useMemo, useState } from "react";
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

export default function MemberDashboard() {
  const { user } = useContext(AuthContext);

  const [leads, setLeads] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedLead, setSelectedLead] = useState(null);
  const [showAddLead, setShowAddLead] = useState(false);
  const [filterStatus, setFilterStatus] = useState("");

  /* ================= FETCH ================= */
  const fetchLeads = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leads`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    const data = await res.json();
    setLeads(data);
  };

  const fetchUsers = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setUsers(await res.json());
  };

  /* 🔁 POLLING */
  useEffect(() => {
    fetchLeads();
    fetchUsers();
    const interval = setInterval(fetchLeads, 8000); // refresh every 8s
    return () => clearInterval(interval);
  }, []);

  /* ================= ACTIONS ================= */
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

  /* ================= FILTERED LEADS ================= */
  const myLeads = useMemo(
    () => leads.filter(l => l.assignedTo === user.email),
    [leads, user.email]
  );
  const leadPond = useMemo(
    () => leads.filter(l => !l.assignedTo || l.assignedTo === "POND"),
    [leads]
  );

  const filteredMyLeads = useMemo(
    () => (filterStatus ? myLeads.filter(l => l.status === filterStatus) : myLeads),
    [myLeads, filterStatus]
  );

  const filteredLeadPond = useMemo(
    () => (filterStatus ? leadPond.filter(l => l.status === filterStatus) : leadPond),
    [leadPond, filterStatus]
  );

  /* ================= AGENT STATS (OPTIONAL FOR MEMBERS) ================= */
  const agentStats = useMemo(() => {
    const stats = {};
    leads.forEach(l => {
      const agent = l.assignedTo || "POND";
      if (!stats[agent]) {
        stats[agent] = {
          total: 0,
          New: 0,
          Contacted: 0,
          "Follow-Up": 0,
          "Under Contract": 0,
          Closed: 0,
        };
      }
      stats[agent].total++;
      const status = l.status || "New";
      if (stats[agent][status] !== undefined) stats[agent][status]++;
    });
    return stats;
  }, [leads]);

  /* ================= RENDER LEAD LIST ================= */
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

  /* ================= RENDER ================= */
  return (
    <div className="dashboard">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isAdmin={false} />
      <div className="main-panel">
        <Topbar />

        {/* DASHBOARD STATS */}
        {activeTab === "dashboard" && (
          <>
            <h2>My Dashboard</h2>

            <div className="stats-grid">
              <StatCard title="My Leads" value={myLeads.length} />
              <StatCard title="Lead Pond" value={leadPond.length} />
              {Object.entries(STATUS_COLORS).map(([status, color]) => (
                <StatCard
                  key={status}
                  title={status}
                  value={leads.filter(l => l.status === status).length}
                  color={color}
                  onClick={() => setFilterStatus(status)}
                />
              ))}
            </div>

            <h3>My Leads</h3>
            <div className="status-filter">
              <label>Filter by Status: </label>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                <option value="">All</option>
                {Object.keys(STATUS_COLORS).map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              {filterStatus && <button onClick={() => setFilterStatus("")}>Clear</button>}
            </div>
            {renderList(filteredMyLeads)}

            <h3>Lead Pond</h3>
            <div className="status-filter">
              <label>Filter by Status: </label>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                <option value="">All</option>
                {Object.keys(STATUS_COLORS).map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              {filterStatus && <button onClick={() => setFilterStatus("")}>Clear</button>}
            </div>
            {renderList(filteredLeadPond)}
          </>
        )}

        {/* ADD NEW LEAD */}
        {activeTab === "my-leads" && (
          <>
            <button className="add-lead-btn" onClick={() => setShowAddLead(p => !p)}>
              {showAddLead ? "Close Lead Form" : "+ Add Lead"}
            </button>

            {showAddLead && (
              <AddLead
                isAdmin={false}
                onLeadAdded={lead => {
                  const newLead = { ...lead, assignedTo: user.email };
                  setLeads(prev => [newLead, ...prev]);
                  setShowAddLead(false);
                }}
              />
            )}

            <div className="status-filter">
              <label>Filter by Status: </label>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                <option value="">All</option>
                {Object.keys(STATUS_COLORS).map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              {filterStatus && <button onClick={() => setFilterStatus("")}>Clear</button>}
            </div>

            {renderList(filteredMyLeads)}
          </>
        )}

        {/* PROFILE */}
        {activeTab === "profile" && <Profile user={user} />}
      </div>

      {selectedLead && (
        <LeadCard
          lead={selectedLead}
          isAdmin={false}
          users={users}
          currentUserEmail={user.email}
          onUpdate={updateLead}
          onClose={() => setSelectedLead(null)}
        />
      )}
    </div>
  );
}

/* ================= SMALL STAT CARD ================= */
function StatCard({ title, value, color, onClick }) {
  return (
    <div
      className="stat-card"
      onClick={onClick}
      style={{ borderTop: color ? `4px solid ${color}` : undefined }}
    >
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );
}
