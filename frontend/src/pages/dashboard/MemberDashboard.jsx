import React, { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import LeadCard from "./LeadCard";
import Profile from "./Profile";
import "./Dashboard.css";

export default function MemberDashboard() {
  const { user } = useContext(AuthContext);
  const [leads, setLeads] = useState([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Refs for scroll
  const profileRef = useRef(null);
  const leadPondRef = useRef(null);
  const myLeadsRef = useRef(null);

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
    } catch (err) {
      console.error("Error fetching leads:", err);
      setLeads([]);
    }
  };

  const handleClaim = async (leadId, userEmail) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leads/${leadId}/assign`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ userId: userEmail }),
      });
      const updatedLead = await res.json();
      setLeads((prev) => prev.map((l) => (l._id === leadId ? updatedLead : l)));
    } catch (err) {
      console.error("Failed to claim lead:", err);
    }
  };

  // Filter leads
  const leadPondLeads = leads.filter(
    (l) => !l.assignedTo || l.assignedTo === "POND" || l.assignedTo === "UNASSIGNED"
  );
  const myLeads = leads.filter((l) => l.assignedTo === user.email);

  return (
    <div className="dashboard">
      <Sidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        scrollRefs={{
          profile: profileRef,
          leadPond: leadPondRef,
          myLeads: myLeadsRef,
        }}
      />
      <div className={`main-panel ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
        <Topbar />

        {/* PROFILE SECTION */}
        <div ref={profileRef} id="profile">
          <Profile />
        </div>

        {/* LEAD POND */}
        <div ref={leadPondRef} id="lead-pond">
          {leadPondLeads.length > 0 && (
            <>
              <h3 style={{ color: "#64b5f6" }}>Lead Pond</h3>
              <div className="leads-grid">
                {leadPondLeads.map((lead) => (
                  <LeadCard
                    key={lead._id}
                    lead={lead}
                    currentUserEmail={user.email}
                    isLeadPond
                    onAssign={handleClaim} // claim the lead
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* MY LEADS */}
        <div ref={myLeadsRef} id="my-leads">
          {myLeads.length > 0 && (
            <>
              <h3>My Leads</h3>
              <div className="leads-grid">
                {myLeads.map((lead) => (
                  <LeadCard
                    key={lead._id}
                    lead={lead}
                    currentUserEmail={user.email}
                    onAssign={handleClaim} // move back to pond
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
