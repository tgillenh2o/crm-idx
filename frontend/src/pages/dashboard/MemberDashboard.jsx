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



const STATUS_ORDER = [
  "New",
  "Contacted",
  "Follow-Up",
  "Under Contract",
  "Closed",
];



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
  const updateLead = async (updated) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leads/${updated._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(updated),
    });
    const saved = await res.json();
    setLeads((prev) => prev.map((l) => (l._id === saved._id ? saved : l)));
    setSelectedLead(saved);
  };

  const claimLead = async (lead) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leads/${lead._id}/assign`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ assignedTo: user.email }),
    });
    updateLead(await res.json());
  };

  /* ================= SORT FUNCTION ================= */
const getStatusIndex = (status) => {
  const idx = STATUS_ORDER.indexOf(status || "New");
  return idx === -1 ? STATUS_ORDER.length : idx;
};

const sortByStatus = (list) =>
  [...list].sort(
    (a, b) => getStatusIndex(a.status) - getStatusIndex(b.status)
  );


  /* ================= FILTERED LISTS ================= */
 const filteredMyLeads = useMemo(() => {
  let list = filterStatus
    ? myLeads.filter((l) => l.status === filterStatus)
    : myLeads;

  return sortBy === "status" ? sortByStatus(list) : list;
}, [myLeads, filterStatus, sortBy]);


  const filteredLeadPond = useMemo(() => {
  let list = filterStatus
    ? leadPond.filter((l) => l.status === filterStatus)
    : leadPond;

  return sortBy === "status" ? sortByStatus(list) : list;
}, [leadPond, filterStatus, sortBy]);


  /* ================= RENDER LIST ================= */
  const renderList = (list) => (
    <div className="lead-list">
      {list.map((lead) => (
        <div
          key={lead._id}
          className={`lead-row status-${(lead.status || "New").toLowerCase().replace(" ", "-")}`}
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
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isAdmin={false} />

      <div className="main-panel">
        <Topbar />

        <div className="dashboard-actions">
          <button className="add-lead-btn" onClick={() => setShowAddLead(true)}>
            + Add Lead
          </button>
<select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
  <option value="status">Sort by Status</option>
</select>

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
                  value={myLeads.filter((l) => l.status === status).length}
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
          onLeadAdded={(lead) => {
            setLeads((prev) => [lead, ...prev]);
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
    <div className="stat-card" onClick={onClick} style={{ borderTop: color ? `4px solid ${color}` : undefined }}>
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );
}
