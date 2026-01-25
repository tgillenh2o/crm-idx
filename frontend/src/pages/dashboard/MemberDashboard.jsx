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
    if (!user?.email) return; // safety check
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leads`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!res.ok) throw new Error("Failed to fetch leads");
      const data = await res.json();
      setLeads(Array.isArray(data) ? data.filter((l) => l.assignedTo === user.email) : []);
    } catch (err) {
      console.error("Leads fetch error:", err);
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [user]); // runs when user loads

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="main-panel">
        <Topbar />

        {/* Stats */}
        <div className="stats-cards">
          <div className="stat-card">
            <p>My Leads</p>
            <h3>{leads.length}</h3>
          </div>
          <div className="stat-card">
            <p>Follow-ups</p>
            <h3>{leads.filter((l) => l.status === "Follow-up").length}</h3>
          </div>
          <div className="stat-card">
            <p>Contacted</p>
            <h3>{leads.filter((l) => l.status === "Contacted").length}</h3>
          </div>
        </div>

        {/* Add Lead */}
        <AddLead
          onLeadAdded={(newLead) => setLeads([newLead, ...leads])}
          currentUser={user}
          isAdmin={false}
        />

        {/* Lead List */}
        <div className="main-content">
          {loading ? (
            <p>Loading leads...</p>
          ) : leads.length > 0 ? (
            leads.map((lead) => <LeadCard key={lead._id} lead={lead} isAdmin={false} />)
          ) : (
            <p>No leads assigned to you.</p>
          )}
        </div>
      </div>
    </div>
  );
}
