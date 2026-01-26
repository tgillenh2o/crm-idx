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
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleAssign = async (leadId) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leads/${leadId}/assign`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ userId: user._id }),
      });
      const updatedLead = await res.json();
      setLeads((prev) => prev.map((l) => (l._id === leadId ? updatedLead : l)));
    } catch (err) {
      console.error(err);
    }
  };

  const leadPondLeads = leads.filter(
    (l) => l.assignedTo === "POND" || !l.assignedTo || l.assignedTo === "UNASSIGNED"
  );
  const myLeads = leads.filter((l) => l.assignedTo === user._id);

  return (
    <div className="dashboard">
      <Sidebar 
  pondCount={leadPondLeads.length} 
  myLeadsCount={otherLeads.length} 
/>

      <div className="main-panel">
        <Topbar />

        {/* Profile Section */}
        <div id="profile">
          <h3 style={{ marginBottom: "8px", color: "#f59e0b" }}>Profile</h3>
          <div className="profile-section">
            <p>
              <strong>Name:</strong> {user.name}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
          </div>
        </div>

        {/* Add Lead Form */}
        <AddLead onLeadAdded={(l) => setLeads([l, ...leads])} currentUser={user} isAdmin={false} />

        {loading ? (
          <p>Loading leads...</p>
        ) : (
          <>
            {/* Lead Pond Section */}
            {leadPondLeads.length > 0 && (
              <div id="lead-pond">
                <h3 className="section-title" id="lead-pond">Lead Pond</h3>
                <div className="leads-grid">
                  {leadPondLeads.map((lead) => (
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

            {/* My Leads Section */}
            {myLeads.length > 0 && (
              <div id="my-leads">
                <h3 className="section-title" id="my-leads">My Leads</h3>
                <div className="leads-grid">
                  {myLeads.map((lead) => (
                    <LeadCard key={lead._id} lead={lead} isAdmin={false} onAssign={handleAssign} />
                  ))}
                </div>
              </div>
            )}

            {leads.length === 0 && <p>No leads found.</p>}
          </>
        )}
      </div>
    </div>
  );
}
