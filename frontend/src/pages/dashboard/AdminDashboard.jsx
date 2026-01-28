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
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState("leads"); // tabs: 'leads', 'profile'

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
      const data = Array.isArray(await res.json()) ? await res.json() : [];
      
      // Detect claimed leads for toast
      data.forEach(l => {
        const oldLead = leads.find(ol => ol._id === l._id);
        if (oldLead?.assignedTo === "POND" && l.assignedTo && l.assignedTo !== "POND" && l.assignedTo !== user.email) {
          setToast(`Lead "${l.name}" claimed by ${l.assignedTo}`);
          const audio = new Audio("/notification.mp3");
          audio.play().catch(() => {});
        }
      });

      setLeads(data);
    } catch (err) { setLeads([]); } finally { setLoading(false); }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = Array.isArray(await res.json()) ? await res.json() : [];
      setUsers(data);
    } catch { setUsers([]); }
  };

  const handleAssign = async (leadId, assignedTo) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leads/${leadId}/assign`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
      body: JSON.stringify({ userId: assignedTo })
    });
    const updatedLead = await res.json();
    setLeads(prev => prev.map(l => l._id === leadId ? updatedLead : l));
  };

  const handleDelete = async (leadId) => {
    if (!window.confirm("Are you sure?")) return;
    await fetch(`${import.meta.env.VITE_API_URL}/api/leads/${leadId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    setLeads(prev => prev.filter(l => l._id !== leadId));
  };

  const leadPond = leads.filter(l => !l.assignedTo || l.assignedTo === "POND");
  const myLeads = leads.filter(l => l.assignedTo && l.assignedTo !== "POND");

  return (
    <div className="dashboard">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      <div className={`main-panel ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
        <Topbar />

        {/* TAB NAV */}
        <div className="tab-nav">
          <button className={activeTab === "leads" ? "active" : ""} onClick={() => setActiveTab("leads")}>Leads</button>
          <button className={activeTab === "profile" ? "active" : ""} onClick={() => setActiveTab("profile")}>Profile</button>
        </div>

        {activeTab === "leads" && (
          <>
            <div className="stats-cards">
              <div className="stat-card"><p>Total Leads</p><h3>{leads.length}</h3></div>
              <div className="stat-card"><p>Follow-ups</p><h3>{leads.filter(l => l.status === "Follow-up").length}</h3></div>
              <div className="stat-card"><p>Contacted</p><h3>{leads.filter(l => l.status === "Contacted").length}</h3></div>
            </div>

            <AddLead onLeadAdded={l => setLeads([l, ...leads])} currentUser={user} isAdmin users={users} />

            {leadPond.length > 0 && (
              <div>
                <h3 style={{ color: "#64b5f6" }}>Lead Pond</h3>
                <div className="leads-grid">
                  {leadPond.map(l => <LeadCard key={l._id} lead={l} isLeadPond currentUserEmail={user.email} onAssign={handleAssign} users={users} />)}
                </div>
              </div>
            )}

            {myLeads.length > 0 && (
              <div>
                <h3>Assigned Leads</h3>
                <div className="leads-grid">
                  {myLeads.map(l => <LeadCard key={l._id} lead={l} isAdmin onAssign={handleAssign} users={users} onDelete={handleDelete} currentUserEmail={user.email} />)}
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === "profile" && <Profile />}

        {toast && (
          <div className="toast">
            {toast} <button onClick={() => setToast(null)}>✖</button>
          </div>
        )}
      </div>
    </div>
  );
}
