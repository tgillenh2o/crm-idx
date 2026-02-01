import React, { useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import LeadCard from "./LeadCard";
import AddLead from "./AddLead";
import Profile from "./Profile";
import "./Dashboard.css";

/* ================= CONSTANTS ================= */
const STATUS_COLORS = {
  New: "#4caf50",
  Contacted: "#2196f3",
  "Follow-Up": "#ff9800",
  "Under Contract": "#9c27b0",
  Closed: "#f44336",
};

const STATUS_ORDER = [
  "New",
  "Contacted",
  "Follow-Up",
  "Under Contract",
  "Closed",
];

/* ================= COMPONENT ================= */
export default function AdminDashboard() {
  const { user } = useContext(AuthContext);

  const [leads, setLeads] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedLead, setSelectedLead] = useState(null);
  const [showAddLead, setShowAddLead] = useState(false);

  const [filterStatus, setFilterStatus] = useState("");
  const [filterAgent, setFilterAgent] = useState("");
  const [sortBy, setSortBy] = useState("status");

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

  useEffect(() => {
    fetchLeads();
    fetchUsers();
    const interval = setInterval(fetchLeads, 8000);
    return () => clearInterval(interval);
  }, []);

  /* ================= ACTIONS ================= */
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

  /* ================= BASE LISTS ================= */
  const myLeads = useMemo(
    () => leads.filter((l) => l.assignedTo === user.email),
    [leads, user.email]
  );

  const leadPond = useMemo(
    () => leads.filter((l) => !l.assignedTo),
    [leads]
  );

  /* ================= SORTING ================= */
  const getStatusIndex = (status) =>
    STATUS_ORDER.indexOf(status || "New");

  const sortLeads = (list) => {
    const sorted = [...list];

    if (sortBy === "status") {
      sorted.sort(
        (a, b) =>
          getStatusIndex(a.status) - getStatusIndex(b.status)
      );
    }

    if (sortBy === "newest") {
      sorted.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    }

    if (sortBy === "oldest") {
      sorted.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
    }

    return sorted;
  };

  /* ================= FILTERED LISTS ================= */
  const filteredLeads = useMemo(() => {
    let list = [...leads];
    if (filterStatus) list = list.filter((l) => l.status === filterStatus);
    if (filterAgent) list = list.filter((l) => l.assignedTo === filterAgent);
    return sortLeads(list);
  }, [leads, filterStatus, filterAgent, sortBy]);

  const filteredMyLeads = useMemo(() => {
    let list = [...myLeads];
    if (filterStatus) list = list.filter((l) => l.status === filterStatus);
    return sortLeads(list);
  }, [myLeads, filterStatus, sortBy]);

  const filteredLeadPond = useMemo(() => {
    let list = [...leadPond];
    if (filterStatus) list = list.filter((l) => l.status === filterStatus);
    return sortLeads(list);
  }, [leadPond, filterStatus, sortBy]);

  /* ================= AGENT STATS ================= */
  const agentStats = useMemo(() => {
    const stats = {};
    leads.forEach((l) => {
      const agent = l.assignedTo || "POND";
      if (!stats[agent]) {
        stats[agent] = { total: 0, Closed: 0 };
      }
      stats[agent].total++;
      if (l.status === "Closed") stats[agent].Closed++;
    });
    return stats;
  }, [leads]);

  /* ================= RENDER LIST ================= */
  const renderList = (list) => (
    <div className="lead-list">
      {list.map((lead) => (
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

        <div className="dashboard-actions">
          <button className="add-lead-btn" onClick={() => setShowAddLead(true)}>
            + Add Lead
          </button>

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="status">Sort by Status</option>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>

        {activeTab === "dashboard" && (
          <>
            <h2>Admin Dashboard</h2>
            <div className="stats-grid">
              <StatCard title="Total Leads" value={leads.length} />
              <StatCard title="Lead Pond" value={leadPond.length} />
            </div>

            <h3>Agents</h3>
            <div className="stats-grid">
              {Object.entries(agentStats).map(([agent, s]) => (
                <StatCard
                  key={agent}
                  title={agent === "POND" ? "Lead Pond" : agent}
                  value={`${s.total} (${s.Closed} closed)`}
                  onClick={() =>
                    setFilterAgent(agent === "POND" ? "" : agent)
                  }
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
          onDelete={deleteLead}
          onClose={() => setSelectedLead(null)}
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
