import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import LeadCard from "./LeadCard";
import "./Dashboard.css";

export default function MemberDashboard() {
  const { user } = useContext(AuthContext);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add Lead Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLead, setNewLead] = useState({
    name: "",
    email: "",
    phone: "",
    assignedTo: user.email,
    status: "New",
  });

  // Fetch leads assigned to this member
  useEffect(() => {
    const fetchLeads = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leads`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        if (!res.ok) {
          console.error("Failed to fetch leads:", res.status);
          setLeads([]);
          setLoading(false);
          return;
        }

        const data = await res.json();
        const memberLeads = Array.isArray(data)
          ? data.filter((lead) => lead.assignedTo === user.email)
          : [];
        setLeads(memberLeads);
      } catch (err) {
        console.error("Leads fetch error:", err);
        setLeads([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, [user]);

  // Handle adding new lead
  const handleAddLead = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(newLead),
      });

      if (!res.ok) {
        console.error("Failed to add lead", res.status);
        return;
      }

      const addedLead = await res.json();
      setLeads([addedLead, ...leads]);
      setNewLead({ ...newLead, name: "", email: "", phone: "", status: "New" });
      setShowAddForm(false);
    } catch (err) {
      console.error("Add lead error:", err);
    }
  };

  return (
    <div className="dashboard">
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Topbar />

        {/* Stats Cards */}
        <div className="stats-cards">
          <div className="stat-card">
            <p>My Leads</p>
            <h3>{leads.length}</h3>
          </div>
          <div className="stat-card">
            <p>Pending Follow-ups</p>
            <h3>{leads.filter((l) => l.status === "Follow-up").length}</h3>
          </div>
          <div className="stat-card">
            <p>Contacted Leads</p>
            <h3>{leads.filter((l) => l.status === "Contacted").length}</h3>
          </div>
        </div>

        {/* Add Lead Form */}
        <div className="add-lead-container">
          <button onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? "Cancel" : "Add Lead"}
          </button>
          {showAddForm && (
            <form className="add-lead-form" onSubmit={handleAddLead}>
              <input
                type="text"
                placeholder="Name"
                value={newLead.name}
                onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={newLead.email}
                onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Phone"
                value={newLead.phone}
                onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                required
              />
              {/* assignedTo is fixed to user.email */}
              <button type="submit">Add Lead</button>
            </form>
          )}
        </div>

        {/* Lead List */}
        <div className="main-content">
          {loading ? (
            <p>Loading your leads...</p>
          ) : leads.length > 0 ? (
            leads.map((lead) => (
              <LeadCard key={lead._id} lead={lead} isAdmin={false} />
            ))
          ) : (
            <p>No leads assigned to you.</p>
          )}
        </div>
      </div>
    </div>
  );
}
