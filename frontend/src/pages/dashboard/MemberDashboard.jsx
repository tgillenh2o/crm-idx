import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import LeadCard from "./LeadCard";
import "./Dashboard.css";

export default function MemberDashboard() {
  const { user } = useContext(AuthContext);
  const [leads, setLeads] = useState([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => { fetchLeads(); }, []);

  const fetchLeads = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leads`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      const data = await res.json();
      setLeads(Array.isArray(data) ? data : []);
    } catch { setLeads([]); }
  };

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

  const leadPondLeads = leads.filter(l => l.assignedTo === "POND" || !l.assignedTo || l.assignedTo === "UNASSIGNED");
  const myLeads = leads.filter(l => l.assignedTo === user.email && l.assignedTo !== "POND");

  return (
    <div className="dashboard">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      <div className={`main-panel ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
        <Topbar />

        {leadPondLeads.length > 0 && (
          <>
            <h3 style={{ color: "#64b5f6" }}>Lead Pond</h3>
            <div className="leads-grid">
              {leadPondLeads.map(l => <LeadCard key={l._id} lead={l} onAssign={handleAssign} currentUserEmail={user.email} isLeadPond />)}
            </div>
          </>
        )}

        {myLeads.length > 0 && (
          <>
            <h3>My Leads</h3>
            <div className="leads-grid">
              {myLeads.map(l => <LeadCard key={l._id} lead={l} onAssign={handleAssign} currentUserEmail={user.email} />)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
