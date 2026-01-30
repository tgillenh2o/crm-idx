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

    const interval = setInterval(fetchLeads, 10000); // refresh every 10s
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

  /* ================= FILTERS ================= */

  const myLeads = leads.filter(l => l.assignedTo === user.email);
  const leadPond = leads.filter(l => !l.assignedTo || l.assignedTo === "POND");

  const filteredLeads = useMemo(() => {
    let list = [...myLeads];
    if (filterStatus) list = list.filter(l => l.status === filterStatus);
    return list;
  }, [myLeads, filterStatus]);

  /* ================= RENDER ================= */

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

  return (
    <div className="dashboard">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isAdmin={false} />

      <div className="main-panel">
        <Topbar />

        {/* DASHBOARD */}
        {activeTab === "dashboard" && (
          <>
            <h2>My Dashboard</h2>

            <div className="stats-grid">
              <StatCard title="Total Leads" value={myLeads.length} />
              <StatCard title="Pond" value={leadPond.length} />

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

        {/* MY LEADS */}
        {activeTab === "my-leads" && (
          <>
            <button
              className="add-lead-btn"
              onClick={() => setShowAddLead(p => !p)}
            >
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

            {renderList(filteredLeads)}
          </>
        )}

        {/* LEAD POND */}
        {activeTab === "lead-pond" && renderList(leadPond)}

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
