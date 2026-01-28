import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import LeadCard from "./LeadCard";
import AddLead from "./AddLead";
import "./Dashboard.css";

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const [leads, setLeads] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [filter24h, setFilter24h] = useState(false);

  useEffect(() => {
    fetchLeads();
    fetchUsers();
    const interval = setInterval(fetchLeads, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leads`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      setLeads(Array.isArray(data) ? data : []);
    } catch { setLeads([]); } finally { setLoading(false); }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch { setUsers([]); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    await fetch(`${import.meta.env.VITE_API_URL}/api/leads/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
    setLeads(prev => prev.filter(l => l._id !== id));
  };

  const handleAssign = async (id, assignedTo) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leads/${id}/assign`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
      body: JSON.stringify({ userId: assignedTo })
    });
    const updated = await res.json();
    setLeads(prev => prev.map(l => l._id === id ? updated : l));
  };

  const now = Date.now();
  const filteredLeads = leads.filter(l => {
    if (!filter24h) return true;
    return now - new Date(l.updatedAt).getTime() <= 24*60*60*1000;
  });

  const leadPond = filteredLeads.filter(l => l.assignedTo === "POND" || !l.assignedTo || l.assignedTo === "UNASSIGNED");
  const otherLeads = filteredLeads.filter(l => !leadPond.includes(l));

  return (
    <div className="dashboard">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      <div className={`main-panel ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
        <Topbar />

        <div>
          <label>
            <input type="checkbox" checked={filter24h} onChange={e => setFilter24h(e.target.checked)} />
            Show leads updated in last 24h
          </label>
        </div>

        <AddLead onLeadAdded={l => setLeads([l,...leads])} currentUser={user} isAdmin={true} users={users} />

        {leadPond.length > 0 && (
          <div>
            <h3 style={{ color: "#64b5f6" }}>Lead Pond</h3>
            <div className="leads-grid">
              {leadPond.map(l => <LeadCard key={l._id} lead={l} isAdmin onAssign={handleAssign} users={users} isLeadPond />)}
            </div>
          </div>
        )}

        {otherLeads.length > 0 && (
          <div>
            <h3>Your Leads</h3>
            <div className="leads-grid">
              {otherLeads.map(l => <LeadCard key={l._id} lead={l} isAdmin onAssign={handleAssign} users={users} onDelete={handleDelete} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
