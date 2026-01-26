// src/pages/dashboard/MemberDashboard.jsx
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import LeadCard from "./LeadCard";
import AddLead from "./AddLead";
import Profile from "./Profile"; // ✅ Import Profile
import "./Dashboard.css";

export default function MemberDashboard() {
  const { user } = useContext(AuthContext);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false); // sidebar state

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leads`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      setLeads(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLeads(); }, []);

  const handleAssign = async (leadId, assignedTo) => {
    try {
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
    } catch (err) { console.error(err); }
  };

  const leadPondLeads = leads.filter(l => l.assignedTo === "POND" || !l.assignedTo || l.assignedTo === "UNASSIGNED");
  const otherLeads = leads.filter(l => !leadPondLeads.includes(l));

  return (
    <div className="dashboard">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className={`main-panel ${collapsed ? "sidebar-collapsed" : ""}`}>
        <Topbar />
        {/* rest of dashboard content */}
      </div>
    </div>
  );
}
    <div className="dashboard">
      <Sidebar />
      <div className="main-panel">
        <Topbar />

        <div className="main-content">
          {/* Profile Tab */}
          <Profile />

          <AddLead onLeadAdded={l => setLeads([l,...leads])} currentUser={user} isAdmin={false} />

          {/* Lead Pond */}
          {leadPondLeads.length > 0 && (
            <div id="lead-pond">
              <h3 className="section-title">Lead Pond</h3>
              <div className="leads-grid">
                {leadPondLeads.map(lead => (
                  <LeadCard
                    key={lead._id}
                    lead={lead}
                    isAdmin={false}
                    onAssign={handleAssign}
                    isLeadPond={true}
                    currentUserEmail={user.email}
                  />
                ))}
              </div>
            </div>
          )}

          {/* My Leads */}
          {otherLeads.length > 0 && (
            <div id="my-leads">
              <h3 className="section-title">My Leads</h3>
              <div className="leads-grid">
                {otherLeads.map(lead => (
                  <LeadCard
                    key={lead._id}
                    lead={lead}
                    isAdmin={false}
                    onAssign={handleAssign}
                    currentUserEmail={user.email}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
