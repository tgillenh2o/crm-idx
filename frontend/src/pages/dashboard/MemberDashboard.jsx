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

  // Fetch leads on mount
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
      console.error("Failed to fetch leads:", err);
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  // ===== CLAIM LEAD FROM POND =====
  const handleClaim = async (leadId) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/leads/${leadId}/claim`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      const updatedLead = await res.json();

      // Move updated lead to top of array to trigger React re-render
      setLeads((prev) => [updatedLead, ...prev.filter((l) => l._id !== leadId)]);
    } catch (err) {
      console.error("Failed to claim lead:", err);
    }
  };

  // ===== RETURN LEAD TO POND =====
 const handleReturn = async (leadId) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leads/${leadId}/return`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    const updatedLead = await res.json();

    // Move the updated lead to the top of the array
    setLeads((prev) => [updatedLead, ...prev.filter((l) => l._id !== leadId)]);
  } catch (err) {
    console.error("Failed to return lead:", err);
  }
};

  // ===== FILTER LEADS =====
  const leadPondLeads = leads.filter(
    (l) =>
      !l.assignedTo ||
      l.assignedTo === "POND" ||
      l.assignedTo === "UNASSIGNED"
  );

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
            <AddLead
              onLeadAdded={(l) => setLeads([l, ...leads])}
              currentUser={user}
              isAdmin={false}
            />

            <h3 style={{ color: "#64b5f6" }}>Lead Pond</h3>

            <div className="leads-grid">
              {leadPondLeads.length === 0 ? (
                <p>No leads in the pond.</p>
              ) : (
                leadPondLeads.map((l) => (
                  <LeadCard
                    key={l._id}
                    lead={l}
                    isLeadPond
                    currentUserEmail={user.email}
                    onAssign={handleClaim} // Claim from pond
                  />
                ))
              )}
            </div>
          </>
        )}

        {/* My Leads */}
        {activeTab === "my-leads" && (
          <>
            <h3>My Leads</h3>
            <div className="leads-grid">
              {myLeads.length === 0 ? (
                <p>You have no leads assigned.</p>
              ) : (
                myLeads.map((l) => (
                  <LeadCard
                    key={l._id}
                    lead={l}
                    currentUserEmail={user.email}
                    onAssign={handleReturn} // Return to pond
                  />
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
