import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import LeadCard from "./LeadCard";
import AddLead from "./AddLead";
import "./Dashboard.css";

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const [leads, setLeads] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch leads
  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leads`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!res.ok) throw new Error("Failed to fetch leads");
      const data = await res.json();
      setLeads(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Leads fetch error:", err);
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch members for dropdown
  const fetchMembers = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!res.ok) throw new Error("Failed to fetch members");
      const data = await res.json();
      setMembers(data);
    } catch (err) {
      console.error("Members fetch error:", err);
      setMembers([]);
    }
  };

  useEffect(() => {
    fetchLeads();
    fetchMembers();
  }, []);

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="main-panel">
        <Topbar />

        {/* Stats */}
        <div className="stats-cards">
          <div className="stat-card">
            <p>Total Leads</p>
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
          members={members}
          isAdmin={true}
        />

        {/* Lead List */}
        <div className="main-content">
          {loading ? (
            <p>Loading leads...</p>
          ) : leads.length > 0 ? (
            leads.map((lead) => <LeadCard key={lead._id} lead={lead} isAdmin={true} onDelete={fetchLeads} />)
          ) : (
            <p>No leads yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
