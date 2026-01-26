import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import LeadCard from "./LeadCard";
import AddLead from "./AddLead";
import "./Dashboard.css";

export default function MemberDashboard() {
  const { user } = useContext(AuthContext);
  const [leads, setLeads] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => { fetchLeads(); fetchUsers(); }, []);

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

  // Members cannot delete leads
  const handleAssign = async (leadId, assignedTo) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leads/${leadId}/assign`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({ userId: assignedTo })
    });
    const updatedLead = await res.json();
    setLeads(prev => prev.map(l => l._id === leadId ? updatedLead : l));
  };

  // Separate lead pond leads
  const leadPondLeads = leads.filter(l => l.assignedTo === "POND" || !l.assignedTo || l.assignedTo === "UNASSIGNED");
  const myLeads = leads.filter(l => l.assignedTo === user.email);

  return (
    <div className="dashboard">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      <div className={`main-panel ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
        <Topbar />

        <div className="stats-cards">
          <div className="stat-card"><p>Total Leads</p><h3>{leads.length}</h3></div>
          <div className="stat-card"><p>Follow-ups</p><h3>{leads.filter(l=>l.status==="Follow-up").length}</h3></div>
          <div className="stat-card"><p>Contacted</p><h3>{leads.filter(l=>l.status==="Contacted").length}</h3></div>
        </div>

        <AddLead onLeadAdded={l => setLeads([l,...leads])} currentUser={user} isAdmin={false} users={users} />

        <div id="lead-pond">
          {leadPondLeads.length > 0 && (
            <>
              <h3 style={{ color: "#64b5f6" }}>Lead Pond</h3>
              <div className="leads-grid">
                {leadPondLeads.map(l => (
                  <LeadCard 
                    key={l._id} 
                    lead={l} 
                    isAdmin={false} 
                    onAssign={handleAssign} 
                    users={users} 
                    isLeadPond
                    currentUserEmail={user.email} 
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div id="my-leads">
          {myLeads.length > 0 && (
            <>
              <h3>My Leads</h3>
              <div className="leads-grid">
                {myLeads.map(l => (
                  <LeadCard 
                    key={l._id} 
                    lead={l} 
                    isAdmin={false} 
                    onAssign={handleAssign} 
                    users={users} 
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
