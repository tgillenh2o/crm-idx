import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import LeadCard from "./LeadCard";
import AddLead from "./AddLead";
import Profile from "./Profile";
import "./Dashboard.css";

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const [leads, setLeads] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("all-leads");

  // Fetch leads and users on mount
  useEffect(() => {
    fetchLeads();
    fetchUsers();
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

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setUsers([]);
    }
  };

  // ===== REASSIGN OR MOVE LEAD =====
  const handleAssign = async (leadId) => {
    // Refetch the updated lead from backend
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leads/${leadId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const updatedLead = await res.json();
      setLeads((prev) => [updatedLead, ...prev.filter((l) => l._id !== leadId)]);
    } catch (err) {
      console.error("Failed to update lead:", err);
    }
  };

  // ===== DELETE LEAD =====
  const handleDelete = async (leadId) => {
    if (!window.confirm("Are you sure you want to delete this lead?")) return;

    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/leads/${leadId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setLeads((prev) => prev.filter((l) => l._id !== leadId));
    } catch (err) {
      console.error("Failed to delete lead:", err);
    }
  };

  return (
    <div className="dashboard">
      <Sidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isAdmin={true}
      />

      <div className={`main-panel ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
        <Topbar />

        {/* Profile */}
        {activeTab === "profile" && <Profile />}

        {/* All Leads */}
        {activeTab === "all-leads" && (
          <>
            <AddLead
              onLeadAdded={(l) => setLeads([l, ...leads])}
              currentUser={user}
              isAdmin={true}
            />

            <h3>All Leads</h3>

            <div className="leads-grid">
              {leads.length === 0 ? (
                <p>No leads found.</p>
              ) : (
                leads.map((l) => (
                  <LeadCard
                    key={l._id}
                    lead={l}
                    isAdmin={true}
                    users={users}
                    onAssign={handleAssign} // reassign / move to pond
                    onDelete={handleDelete}
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
