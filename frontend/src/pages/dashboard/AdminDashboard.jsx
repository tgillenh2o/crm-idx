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
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("all-leads");
  const [selectedLead, setSelectedLead] = useState(null);

  useEffect(() => {
    fetchLeads();
    fetchUsers();
  }, []);

  const fetchLeads = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leads`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    const data = await res.json();
    setLeads(Array.isArray(data) ? data : []);
  };

  const fetchUsers = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    const data = await res.json();
    setUsers(Array.isArray(data) ? data : []);
  };

  const updateLeadAssignment = (leadId, assignedTo) => {
    setLeads(prev =>
      prev.map(l =>
        l._id === leadId ? { ...l, assignedTo } : l
      )
    );
    setSelectedLead(null);
  };

  const allLeads = leads;
  const myLeads = leads.filter(l => l.assignedTo === user.email);
  const leadPond = leads.filter(
    l => !l.assignedTo || l.assignedTo === "POND"
  );

  const renderLeadList = list => (
    <div className="lead-list">
      {list.map(lead => (
        <div
          key={lead._id}
          className={`lead-row status-${lead.status.toLowerCase()}`}
          onClick={() => setSelectedLead(lead)}
        >
          <span className="lead-name">{lead.name}</span>
          <span>{lead.email}</span>
          <span>{lead.assignedTo || "POND"}</span>
          <span>{lead.status}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="dashboard">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isAdmin
      />

      <div className="main-panel">
        <Topbar />

        {activeTab === "all-leads" && (
          <>
            <AddLead onLeadAdded={l => setLeads([l, ...leads])} isAdmin />
            <h3>All Leads</h3>
            {renderLeadList(allLeads)}
          </>
        )}

        {activeTab === "lead-pond" && (
          <>
            <h3>Lead Pond</h3>
            {renderLeadList(leadPond)}
          </>
        )}

        {activeTab === "my-leads" && (
          <>
            <h3>My Leads</h3>
            {renderLeadList(myLeads)}
          </>
        )}
      </div>

      {selectedLead && (
        <LeadCard
          lead={selectedLead}
          isAdmin
          users={users}
          currentUserEmail={user.email}
          onAssign={updateLeadAssignment}
          onClose={() => setSelectedLead(null)}
        />
      )}
    </div>
  );
}
