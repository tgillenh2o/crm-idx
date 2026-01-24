import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import LeadCard from "./LeadCard";
import "./Dashboard.css";

export default function MemberDashboard() {
  const { user } = useContext(AuthContext);
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leads/member`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        });
        const data = await res.json();
        setLeads(data);
      } catch (err) {
        console.error("Leads fetch error:", err);
      }
    };

    fetchLeads();
  }, []);

  return (
    <div className="dashboard">
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Topbar />
        <div className="main-content">
          {leads.map(lead => (
            <LeadCard key={lead._id} lead={lead} isAdmin={false} />
          ))}
        </div>
      </div>
    </div>
  );
}
