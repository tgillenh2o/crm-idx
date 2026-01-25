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
    if(!user?.email) return;
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leads`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
      const data = await res.json();
      const myLeads = Array.isArray(data) ? data.filter(l=>{
        if(!l.assignedTo) return false;
        if(typeof l.assignedTo==="string") return l.assignedTo===user.email;
        if(typeof l.assignedTo==="object") return l.assignedTo.email===user.email;
        return false;
      }) : [];
      setLeads(myLeads);
    } catch (err){ console.error(err); setLeads([]); } 
    finally { setLoading(false); }
  }

  useEffect(()=>{ fetchLeads(); }, [user]);

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="main-panel">
        <Topbar />
        <div className="stats-cards">
          <div className="stat-card"><p>My Leads</p><h3>{leads.length}</h3></div>
          <div className="stat-card"><p>Follow-ups</p><h3>{leads.filter(l=>l.status==="Follow-up").length}</h3></div>
          <div className="stat-card"><p>Contacted</p><h3>{leads.filter(l=>l.status==="Contacted").length}</h3></div>
        </div>

        <AddLead onLeadAdded={l=>setLeads([l,...leads])} currentUser={user} isAdmin={false} />

        <div className="main-content">
          {loading ? <p>Loading leads...</p> :
            leads.length>0 ? <div className="leads-grid">
              {leads.map(lead=><LeadCard key={lead._id} lead={lead} isAdmin={false} />)}
            </div> : <p>No leads assigned to you.</p>
          }
        </div>
      </div>
    </div>
  );
}
