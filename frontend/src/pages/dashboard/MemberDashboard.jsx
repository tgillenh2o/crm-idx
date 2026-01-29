import React, { useEffect, useState, useContext } from "react";
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
  const [selectedLead, setSelectedLead] = useState(null);
  const [showAddLeadForm, setShowAddLeadForm] = useState(false);

  // Fetch all leads for member
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

  // Update assignedTo in state
  const handleAssign = (leadId, assignedTo) => {
    setLeads((prev) =>
      prev.map((l) => (l._id === leadId ? { ...l, assignedTo } : l))
    );
  };

  // Add new lead
  const handleAddLead = (newLead) => {
    setLeads((prev) => [newLead, ...prev]);
    setShowAddLeadForm(false);
  };

  // Filter leads by tab
  const leadPondLeads = leads.filter(
    (l) => !l.assignedTo || l.assignedTo === "POND" || l.assignedTo === "UNASSIGNED"
  );
  const myLeads = leads.filter((l) => l.assignedTo === user.email);

  const getLeadsForTab = () => {
    switch (activeTab) {
      case "lead-pond":
        return leadPondLeads;
      case "my-leads":
        return myLeads;
      default:
        return [];
    }
  };

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

        {/* Lead List Tabs */}
        {["lead-pond", "my-leads"].includes(activeTab) && (
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
                isAdmin={false}
                onCancel={() => setShowAddLeadForm(false)}
              />
            )}

            <h3>{activeTab === "lead-pond" ? "Lead Pond" : "My Leads"}</h3>

            {loading ? (
              <p>Loading leads...</p>
            ) : (
              <div className="lead-list">
  {getLeadsForTab().length === 0 && <p>No leads to display.</p>}
  {getLeadsForTab().map((lead) => (
    <div
      key={lead._id}
      className="lead-row"
      onClick={() => setSelectedLead(lead)}
    >
      <span className="lead-name">{lead.name}</span>
      <span>{lead.email}</span>
      <span>{lead.phone}</span>
      <span>{lead.assignedTo || "Unassigned"}</span>
      <span>{lead.status}</span>
    </div>
  ))}
</div>

            )}
          </>
        )}

        {/* Lead Details Modal */}
        {selectedLead && (
          <LeadCard
            lead={selectedLead}
            isAdmin={false}
            currentUserEmail={user.email}
            onClose={() => setSelectedLead(null)}
            onAssign={handleAssign}
          />
        )}
      </div>
    </div>
  );
}
