import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./Dashboard.css"; 
import LeadCard from "./LeadCard";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";


export default function MemberDashboard() {
  const { user } = useContext(AuthContext);
  const [leads, setLeads] = useState([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leads`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      setLeads(Array.isArray(data) ? data : []);
    } catch {
      setLeads([]);
    }
  };

  const handleClaim = async (leadId) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leads/${leadId}/assign`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ userId: user.email }),
      });
      const updatedLead = await res.json();
      setLeads(prev => prev.map(l => (l._id === leadId ? updatedLead : l)));
    } catch (err) {
      console.error(err);
    }
  };

  const leadPondLeads = leads.filter(
    l => !l.assignedTo || l.assignedTo === "POND" || l.assignedTo === "UNASSIGNED"
  );
  const myLeads = leads.filter(l => l.assignedTo === user.email);

  return (
    <div className="dashboard">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      <div className={`main-panel ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
        <Topbar />

        {/* Lead Pond */}
        <div id="lead-pond">
          {leadPondLeads.length > 0 && (
            <>
              <h3 style={{ color: "#64b5f6" }}>Lead Pond</h3>
              <div className="leads-grid">
                {leadPondLeads.map(l => (
                  <LeadCard
                    key={l._id}
                    lead={l}
                    currentUserEmail={user.email}
                    isLeadPond
                    onAssign={handleClaim}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* My Leads */}
        <div id="my-leads">
          {myLeads.length > 0 && (
            <>
              <h3>My Leads</h3>
              <div className="leads-grid">
                {myLeads.map(l => (
                  <LeadCard
                    key={l._id}
                    lead={l}
                    currentUserEmail={user.email}
                    onAssign={handleClaim}
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
