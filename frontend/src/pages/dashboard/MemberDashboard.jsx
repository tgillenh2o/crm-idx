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
    setLeads(await res.json());
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
    const interval = setInterval(fetchLeads, 8000);
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

  /* ================= FILTERED LISTS ================= */
  const myLeads = leads.filter(l => l.assignedTo === user.email);
  const filteredMyLeads = filterStatus
    ? myLeads.filter(l => l.status === filterStatus)
    : myLeads;

  const leadPond = leads.filter(l => !l.assignedTo || l.assignedTo === "POND");
  const filteredLeadPond = filterStatus
    ? leadPond.filter(l => l.status === filterStatus)
    : leadPond;

  const agentStats = useMemo(() => {
    const stats = {};
    leads.forEach(l => {
      const agent = l.assignedTo || "POND";
      stats[agent] = (stats[agent] || 0) + 1;
    });
    return stats;
  }, [leads]);

  /* ================= RENDER LIST ================= */
  const renderList = list => (
    <div className="lead-list">
      {list.map(lead => (
        <div
          key={lead._id}
          className={`lead-row status-${(lead.status || "New")
            .toLowerCase()
            .replace(" ", "-")}`}
          onClick={() => setSelectedLead(lead)}
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
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isAdmin={false}
      />

      <div className="main-panel">
        <Topbar />

        <div className="dashboard-actions">
          <button
            className="add-lead-btn"
            onClick={() => setShowAddLead(true)}
          >
            + Add Lead
          </button>
        </div>

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
                  value={myLeads.filter(l => l.status === status).length}
                  color={color}
                  onClick={() => setFilterStatus(status)}
                />
              ))}
            </div>
          </>
        )}

        {activeTab === "my-leads" && renderList(filteredMyLeads)}
        {activeTab === "lead-pond" && renderList(filteredLeadPond)}
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

      {showAddLead && (
        <AddLead
          onLeadAdded={lead => {
            setLeads(prev => [lead, ...prev]);
            setShowAddLead(false);
          }}
          onClose={() => setShowAddLead(false)}
        />
      )}
    </div>
  );
}

/* ================= STAT CARD ================= */
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
