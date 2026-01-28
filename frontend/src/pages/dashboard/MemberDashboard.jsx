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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [filter24h, setFilter24h] = useState(false);
  const [toast, setToast] = useState(null);

  // Polling every 5s
  useEffect(() => {
    fetchLeads();
    const interval = setInterval(fetchLeads, 5000);
    return () => clearInterval(interval);
  }, []);

  // Fetch leads
  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leads`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      const newLeads = Array.isArray(data) ? data : [];

      // Detect any leads claimed by others
      newLeads.forEach((l) => {
        const oldLead = leads.find(ol => ol._id === l._id);
        if (oldLead?.assignedTo === "POND" && l.assignedTo && l.assignedTo !== "POND" && l.assignedTo !== user.email) {
          // Trigger toast + sound
          setToast(`Lead "${l.name}" claimed by ${l.assignedTo}`);
          const audio = new Audio("/notification.mp3"); // add notification.mp3 to public/
          audio.play().catch(() => {}); // avoid promise error if blocked
        }
      });

      setLeads(newLeads);
    } catch {
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  // Claim a lead from pond
  const handleAssign = async (leadId, assignedTo) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leads/${leadId}/assign`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
      body: JSON.stringify({ userId: assignedTo })
    });
    const updated = await res.json();
    setLeads(prev => prev.map(l => l._id === leadId ? updated : l));
  };

  // Move lead back to pond
  const moveToPond = async (leadId) => {
    handleAssign(leadId, "POND");
  };

  // 24-hour filter
  const now = Date.now();
  const filteredLeads = leads.filter(l => {
    if (!filter24h) return true;
    return now - new Date(l.updatedAt).getTime() <= 24*60*60*1000;
  });

  // Separate pond vs mine
  const leadPond = filteredLeads.filter(l => l.assignedTo === "POND" || !l.assignedTo || l.assignedTo === "UNASSIGNED");
  const myLeads = filteredLeads.filter(l => l.assignedTo === user.email);

  return (
    <div className="dashboard">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      <div className={`main-panel ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
        <Topbar />

        <div>
          <label>
            <input type="checkbox" checked={filter24h} onChange={e => setFilter24h(e.target.checked)} />
            Show leads updated in last 24h
          </label>
        </div>

        <AddLead onLeadAdded={l => setLeads([l,...leads])} currentUser={user} isAdmin={false} />

        {/* LEAD POND */}
        {leadPond.length > 0 && (
          <div>
            <h3 style={{ color: "#64b5f6" }}>Lead Pond</h3>
            <div className="leads-grid">
              {leadPond.map(l => (
                <LeadCard
                  key={l._id}
                  lead={l}
                  isLeadPond
                  currentUserEmail={user.email}
                  onAssign={handleAssign}
                />
              ))}
            </div>
          </div>
        )}

        {/* MY LEADS */}
        {myLeads.length > 0 && (
          <div>
            <h3>My Leads</h3>
            <div className="leads-grid">
              {myLeads.map(l => (
                <LeadCard
                  key={l._id}
                  lead={l}
                  currentUserEmail={user.email}
                  onAssign={moveToPond}
                />
              ))}
            </div>
          </div>
        )}

        {/* TOAST */}
        {toast && (
          <div className="toast">
            {toast}
            <button onClick={() => setToast(null)}>✖</button>
          </div>
        )}
      </div>
    </div>
  );
}
