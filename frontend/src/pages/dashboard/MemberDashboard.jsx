import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import LeadCard from "./LeadCard";
import "./Dashboard.css";

export default function MemberDashboard() {
  const { user } = useContext(AuthContext);
  const [leads, setLeads] = useState([]);
  const [activeTab, setActiveTab] = useState("my-leads");
  const [selectedLead, setSelectedLead] = useState(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leads`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      // Only show leads assigned to the member or Pond
      const filtered = data.filter(
        (lead) => lead.assignedTo === user.email || lead.assignedTo === "POND"
      );
      setLeads(filtered);
    } catch (err) {
      console.error("Fetch leads failed:", err);
    }
  };

  const claimLead = async (id) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/leads/${id}/claim`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchLeads();
    } catch (err) {
      console.error("Claim failed:", err);
    }
  };

  const returnToPond = async (id) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/leads/${id}/return`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchLeads();
    } catch (err) {
      console.error("Return failed:", err);
    }
  };

  const updateLead = (updatedLead) => {
    setLeads((prev) =>
      prev.map((l) => (l._id === updatedLead._id ? updatedLead : l))
    );
    setSelectedLead(updatedLead);
  };

  const addInteraction = (interactions) => {
    if (!selectedLead) return;
    setSelectedLead({ ...selectedLead, interactions });
  };

  const myLeads = leads.filter((l) => l.assignedTo === user.email);
  const leadPond = leads.filter((l) => l.assignedTo === "POND");

  const renderList = (list) => (
    <div className="lead-list">
      {list.map((lead) => (
        <div
          key={lead._id}
          className={`lead-row status-${lead.status
            .toLowerCase()
            .replace(" ", "_")}`}
          onClick={() => setSelectedLead(lead)}
        >
          <span className="lead-name">{lead.name}</span>
          <span>{lead.email}</span>
          <span>{lead.assignedTo}</span>
          <span>{lead.status}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="dashboard">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isAdmin={false} />

      <div className="main-panel">
        <Topbar />

        {activeTab === "my-leads" && (
          <>
            <h3>My Leads</h3>
            {renderList(myLeads)}
          </>
        )}

        {activeTab === "lead-pond" && (
          <>
            <h3>Lead Pond</h3>
            {renderList(leadPond)}
          </>
        )}
      </div>

      {selectedLead && (
        <LeadCard
          lead={selectedLead}
          isAdmin={false}
          currentUserEmail={user.email}
          showReassign={false} // members cannot reassign
          onUpdate={updateLead}
          onClose={() => setSelectedLead(null)}
          claimLead={claimLead}
          returnToPond={returnToPond}
          addInteraction={addInteraction}
        />
      )}
    </div>
  );
}
