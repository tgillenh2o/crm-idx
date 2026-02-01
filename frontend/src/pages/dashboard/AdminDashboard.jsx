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

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);

  const [leads, setLeads] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedLead, setSelectedLead] = useState(null);
  const [showAddLead, setShowAddLead] = useState(false);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterAgent, setFilterAgent] = useState("");
  const [sortBy, setSortBy] = useState("newest"); // Added sorting

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
  // Update lead and persist to backend
  const updateLead = async (updated) => {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/leads/${updated._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(updated),
      }
    );
    const saved = await res.json();
    setLeads((prev) => prev.map((l) => (l._id === saved._id ? saved : l)));
    setSelectedLead(saved);
  };

  const deleteLead = async (id) => {
    await fetch(`${import.meta.env.VITE_API_URL}/api/leads/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setLeads((prev) => prev.filter((l) => l._id !== id));
    setSelectedLead(null);
  };

  const claimLead = async (lead) => {
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

  /* ================= FILTERED & SORTED LISTS ================= */
  const filteredLeads = useMemo(() => {
    let list = [...leads];
    if (filterStatus) list = list.filter((l) => l.status === filterStatus);
    if (filterAgent) list = list.filter((l) => l.assignedTo === filterAgent);

    // Sort by newest or oldest
    list.sort((a, b) =>
      sortBy === "newest"
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt)
    );

    return list;
  }, [leads, filterStatus, filterAgent, sortBy]);

  const myLeads = leads.filter((l) => l.assignedTo === user.email);
  const filteredMyLeads = filterStatus
    ? myLeads.filter((l) => l.status === filterStatus)
    : myLeads;

  const leadPond = leads.filter((l) => !l.assignedTo || l.assignedTo === "POND");
  const filteredLeadPond = filterStatus
    ? leadPond.filter((l) => l.status === filterStatus)
    : leadPond;

  /* ================= AGENT STATS ================= */
  const agentStats = useMemo(() => {
    const stats = {};
    leads.forEach((l) => {
      const agent = l.assignedTo || "POND";
      if (!stats[agent]) {
        stats[agent] = { total: 0, New: 0, Contacted: 0, "Follow-Up": 0, "Under Contract": 0, Closed: 0 };
      }
      stats[agent].total++;
      const status = l.status || "New";
      if (stats[agent][status] !== undefined) stats[agent][status]++;
    });
    return stats;
  }, [leads]);

  /* ================= RENDER LIST ================= */
  const renderList = (list) => (
    <div className="lead-list">
      {list.map((lead) => (
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
              onClick={(e) => {
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
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isAdmin />

      <div className="main-panel">
        <Topbar />

        {/* GLOBAL ADD LEAD BUTTON */}
        <div className="dashboard-actions">
          <button className="add-lead-btn" onClick={() => setShowAddLead(true)}>
            + Add Lead
          </button>
          {/* Sorting dropdown */}
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>

        {/* DASHBOARD STATS */}
        {activeTab === "dashboard" && (
          <>
            <h2>Admin Dashboard</h2>
            <div className="stats-grid">
              <StatCard title="Total Leads" value={leads.length} />
              <StatCard title="Lead Pond" value={leadPond.length} />
              {Object.entries(STATUS_COLORS).map(([status, color]) => (
                <StatCard
                  key={status}
                  title={status}
                  value={leads.filter((l) => l.status === status).length}
                  color={color}
                  onClick={() => setFilterStatus(status)}
                />
              ))}
            </div>

            <h3>Agents</h3>
            <div className="stats-grid">
              {Object.entries(agentStats).map(([agent, s]) => (
                <StatCard
                  key={agent}
                  title={agent === "POND" ? "Lead Pond" : agent}
                  value={`${s.total} (${s.Closed} closed)`}
                  onClick={() => setFilterAgent(agent === "POND" ? "" : agent)}
                />
              ))}
            </div>
          </>
        )}

        {activeTab === "all-leads" && renderList(filteredLeads)}
        {activeTab === "my-leads" && renderList(filteredMyLeads)}
        {activeTab === "lead-pond" && renderList(filteredLeadPond)}
        {activeTab === "profile" && <Profile user={user} />}
      </div>

      {/* ADD LEAD MODAL */}
      {showAddLead && (
        <AddLead
          isAdmin
          onLeadAdded={(lead) => {
            setLeads((prev) => [lead, ...prev]);
            setShowAddLead(false);
          }}
          onClose={() => setShowAddLead(false)}
        />
      )}

      {selectedLead && (
        <LeadCard
          lead={selectedLead}
          isAdmin
          users={users}
          currentUserEmail={user.email}
          onUpdate={updateLead}
          onDelete={deleteLead} // Pass delete function
          onClose={() => setSelectedLead(null)}
        />
      )}
    </div>
  );
}

/* ================= SMALL STAT CARD ================= */
function StatCard({ title, value, color, onClick }) {
  return (
    <div className="stat-card" onClick={onClick} style={{ borderTop: color ? `4px solid ${color}` : undefined }}>
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );
}
