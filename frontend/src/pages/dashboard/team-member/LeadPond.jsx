// src/pages/dashboard/team-member/LeadPond.jsx
import React, { useEffect, useState } from "react";
import api from "../../../api";
import LeadList from "../../../components/LeadList";

const LeadPond = () => {
  const [pondLeads, setPondLeads] = useState([]);

  useEffect(() => {
    fetchPond();
  }, []);

  const fetchPond = async () => {
    try {
      const res = await api.get("/leads/pond"); // unassigned leads
      setPondLeads(res.data.leads);
    } catch (err) {
      console.error("❌ Failed to fetch pond leads:", err);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Lead Pond</h2>
      <LeadList leads={pondLeads} />
    </div>
  );
};

export default LeadPond;
