// src/pages/dashboard/independent/MyLeads.jsx
import React, { useEffect, useState } from "react";
import api from "../../../api";
import LeadList from "../../../components/LeadList";

const IndependentMyLeads = () => {
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await api.get("/leads");
      setLeads(res.data.leads);
    } catch (err) {
      console.error("❌ Failed to fetch leads:", err);
    }
  };

  const handleUpdateLead = async (updatedLead) => {
    try {
      await api.put(`/leads/${updatedLead._id}`, updatedLead);
      fetchLeads();
    } catch (err) {
      console.error("❌ Failed to update lead:", err);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">My Leads</h2>
      <LeadList leads={leads} onUpdateLead={handleUpdateLead} />
    </div>
  );
};

export default IndependentMyLeads;
