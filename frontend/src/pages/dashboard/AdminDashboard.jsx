import React, { useEffect, useState, useContext } from "react";
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
  const [activeTab, setActiveTab] = useState("lead-pond");
  const [showAddLeadForm, setShowAddLeadForm] = useState(false);

  // Fetch leads
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
      console.error(err);
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
      setUsers(data || []);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setUsers([]);
    }
  };

  // ======= Handle Lead Updates =======
  const handleAssign = (leadId, assignedTo) => {
    setLeads((prev) =>
      prev.map((l) => (l._id === leadId ? { ...l, assignedTo } : l))
    );
  };

  const handleDelete = (leadId) => {
    setLeads((prev) => prev.filter((l) => l._id !== leadId));
  };

  const handleAddLead = (newLead) => {
    setLeads((prev) => [newLead, ...prev]);
    setShowAddLeadForm(false);
  };

  // Filter leads for tabs
  const leadPondLeads = leads.filter(
    (l) => !l.assignedTo || l.assignedTo === "POND" || l.assignedTo === "UNASSIGNED"
  );

  const myLeads = leads.filter((l) => l.assignedTo === user.email);

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

        {/* Lead Pond */}
        {activeTab === "lead-pond" && (
          <>
            <button
              className="toggle-add-lead-button"
              onClick={() => setShowAddLeadForm((prev) => !prev)}
            >
              {showAddLeadForm ? "Close Form" : "Add Lead"}
            </button>

            {showAddLeadForm && (
              <AddLead
                onLeadAdded={handleAddLead}
                currentUser={user}
                isAdmin={true}
                onCancel={() => setShowAddLeadForm(false)}
              />
            )}

            <h3 style={{ color: "#64b5f6" }}>Lead Pond</h3>
            <div className="leads-grid">
              {leadPondLeads.map((l) => (
                <LeadCard
                  key={l._id}
                  lead={l}
                  isAdmin={true}
                  currentUserEmail={user.email}
                  onAssign={handleAssign}
                  onDelete={handleDelete}
                  users={users}
                  isLeadPond={true}
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
                  isAdmin={true}
                  currentUserEmail={user.email}
                  onAssign={handleAssign}
                  onDelete={handleDelete}
                  users={users}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
