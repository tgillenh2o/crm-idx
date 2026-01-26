import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import LeadCard from "./LeadCard";
import AddLead from "./AddLead";
import "./Dashboard.css";




export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const [leads,setLeads] = useState([]);
  const [users,setUsers] = useState([]);
  const [loading,setLoading] = useState(true);

  const fetchLeads = async ()=>{
    setLoading(true);
    try{
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leads`,{headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}});
      const data = await res.json();
      setLeads(Array.isArray(data)?data:[]);
    }catch(err){console.error(err);setLeads([]);}
    finally{setLoading(false);}
  };

  const fetchUsers = async ()=>{
    try{
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users`,{headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}});
      const data = await res.json();
      setUsers(Array.isArray(data)?data:[]);
    }catch(err){console.error(err);setUsers([]);}
  };

  useEffect(()=>{ fetchLeads(); fetchUsers(); },[]);

  const handleDelete = async leadId=>{
    if(!window.confirm("Are you sure?")) return;
    try{
      await fetch(`${import.meta.env.VITE_API_URL}/api/leads/${leadId}`,{method:"DELETE",headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}});
      setLeads(leads.filter(l=>l._id!==leadId));
    }catch(err){console.error(err);}
  };

  const handleAssign = async (leadId,assignedTo)=>{
    try{
      setLeads(prev=>prev.map(l=>l._id===leadId?{...l,removing:true}:l));
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leads/${leadId}/assign`,{
        method:"PATCH",
        headers:{"Content-Type":"application/json",Authorization:`Bearer ${localStorage.getItem("token")}`},
        body: JSON.stringify({userId:assignedTo})
      });
      const updatedLead = await res.json();
      setTimeout(()=>{ setLeads(prev=>prev.map(l=>l._id===leadId?updatedLead:l)); },300);
    }catch(err){console.error(err);}
  };

  const leadPondLeads = leads.filter(l=>l.assignedTo==="POND"||!l.assignedTo||l.assignedTo==="UNASSIGNED");
  const otherLeads = leads.filter(l=>!leadPondLeads.includes(l));

  return (
    <div className="dashboard">
      <Sidebar pondCount={leadPondLeads.length} myLeadsCount={otherLeads.length}/>
      <div className="main-panel">
        <Topbar/>
        <div className="stats-cards">
          <div className="stat-card"><p>Total Leads</p><h3>{leads.length}</h3></div>
          <div className="stat-card"><p>Follow-ups</p><h3>{leads.filter(l=>l.status==="Follow-up").length}</h3></div>
          <div className="stat-card"><p>Contacted</p><h3>{leads.filter(l=>l.status==="Contacted").length}</h3></div>
        </div>

        <AddLead onLeadAdded={l=>setLeads([l,...leads])} currentUser={user} isAdmin={true} users={users}/>
<div id="profile">
  <Profile /> {/* import Profile from "./Profile" */}
</div>

        <div className="main-content">
          {loading ? <p>Loading leads...</p> :
            <>
              {leadPondLeads.length>0 && <div id="lead-pond">
                <h3 className="section-title">Lead Pond</h3>
                <div className="leads-grid">
                  {leadPondLeads.map(l=>
                    <LeadCard
                      key={l._id}
                      lead={l}
                      isAdmin={true}
                      onDelete={handleDelete}
                      onAssign={handleAssign}
                      isLeadPond={true}
                      currentUserEmail={user.email}
                      users={users}
                    />
                  )}
                </div>
              </div>}

              {otherLeads.length>0 && <div id="my-leads">
                <h3 className="section-title">My Leads</h3>
                <div className="leads-grid">
                  {otherLeads.map(l=>
                    <LeadCard
                      key={l._id}
                      lead={l}
                      
                    
                      onAssign={handleAssign}
                      currentUserEmail={user.email}
                      users={users}
                    />
                  )}
                </div>
              </div>}

              {leads.length===0 && <p>No leads found.</p>}
            </>
          }
        </div>
      </div>
    </div>
  );
}
