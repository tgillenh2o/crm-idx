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
  const [filter24h, setFilter24h] = useState(false);
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState("leads");

  useEffect(() => {
    fetchLeads();
    const interval = setInterval(fetchLeads, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leads`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      setLeads(Array.isArray(data) ? data : []);
    } catch {
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (leadId, assignedTo) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leads/${leadId}/assign`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
      body: JSON.stringify({ userId: assignedTo }),
    });
    const updated = await res.json();
    setLeads(prev => prev.map(l => l._id === leadId ? updated : l));
  };

  const moveToPond = async (leadId) => handleAssign(leadId, "POND");

  const now = Date.now();
  const filteredLeads = leads.filter(
    l => !filter24h || (now - new Date(l.updatedAt).getTime() <= 24 * 60 * 60 * 1000)
  );

  const leadPond = filteredLeads.filter(
    l => !l.assignedTo || l.assignedTo === "POND" || l.assignedTo === "UNASSIGNED"
  );

  const myLeads = filteredLeads.filter(
    l => l.assignedTo === user.email
  );

  return (
    <div className="dashboard">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      <div className={`main-panel ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
        <Topbar />

        <div className="tab-nav">
          <button className={activeTab === "leads" ? "active" : ""} onClick={() => setActiveTab("leads")}>Leads</button>
          <button className={activeTab === "profile" ? "active" : ""} onClick={() => setActiveTab("profile")}>Profile</button>
        </div>

        {activeTab === "leads" && (
          <>
            <div style={{ marginBottom: "12px" }}>
              <label>
                <input type="checkbox" checked={filter24h} onChange={e => setFilter24h(e.target.checked)} />
                Show leads updated in last 24h
              </label>
            </div>

            <AddLead onLeadAdded={l => setLeads([l, ...leads])} currentUser={user} isAdmin={false} />

            {leadPond.length > 0 && (
              <div>
                <h3 style={{ color: "#64b5f6" }}>Lead Pond</h3>
                <div className="leads-grid">
                  {leadPond.map(l => <LeadCard key={l._id} lead={l} isLeadPond currentUserEmail={user.email} onAssign={handleAssign} />)}
                </div>
              </div>
            )}

            {myLeads.length > 0 && (
              <div>
                <h3>My Leads</h3>
                <div className="leads-grid">
                  {myLeads.map(l => <LeadCard key={l._id} lead={l} currentUserEmail={user.email} onAssign={moveToPond} />)}
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === "profile" && <Profile />}

        {toast && (
          <div className="toast">
            {toast} <button onClick={() => setToast(null)}>✖</button>
          </div>
        )}
      </div>
    </div>
  );
}
