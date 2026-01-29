import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import LeadCard from "./LeadCard";
import AddLead from "./AddLead";
import Profile from "./Profile";
import "./Dashboard.css";

export default function MemberDashboard() {
  const { user } = useContext(AuthContext);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("lead-pond");

  useEffect(() => {
    fetchLeads();
  }, []);

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

  // Update lead in state after claim/return
  const updateLead = (updatedLead) => {
    setLeads((prev) => [
      updatedLead,
      ...prev.filter((l) => l._id !== updatedLead._id),
    ]);
  };

  // Lead Pond = unassigned/pond leads
  const leadPondLeads = leads.filter(
    (l) =>
      !l.assignedTo || l.assignedTo.toUpperCase() === "POND" || l.assignedTo.toUpperCase() === "UNASSIGNED"
  );

  // My Leads = assigned to current member
  const myLeads = leads.filter((l) => l.assignedTo === user.email);

  return (
    <div className="dashboard">
      <Sidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isAdmin={false}
      />

      <div className={`main-panel ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
        <Topbar />

        {/* Profile */}
        {activeTab === "profile" && <Profile />}

        {/* Lead Pond */}
        {activeTab === "lead-pond" && (
          <>
            <AddLead onLeadAdded={(l) => setLeads([l, ...leads])} currentUser={user} isAdmin={false} />
            <h3 style={{ color: "#64b5f6" }}>Lead Pond</h3>
            <div className="leads-grid">
              {leadPondLeads.map((l) => (
                <LeadCard
                  key={l._id}
                  lead={l}
                  isLeadPond
                  currentUserEmail={user.email}
                  onAssign={updateLead}
                />
              ))}
            </div>
          </>
        )}

        {/* My Leads */}
        {activeTab === "my-leads" && (
          <>
            <h3>My Leads</h3>
            <div className="leads-grid">
              {myLeads.map((l) => (
                <LeadCard
                  key={l._id}
                  lead={l}
                  currentUserEmail={user.email}
                  onAssign={updateLead}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
