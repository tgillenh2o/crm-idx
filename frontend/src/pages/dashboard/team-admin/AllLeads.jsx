// src/pages/dashboard/team-admin/AllLeads.jsx
import React, { useEffect, useState } from "react";
import api from "../../../api";
import LeadList from "../../../components/LeadList";
import AssignLeadModal from "./AssignLeadModal";

const AllLeads = () => {
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

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

  const openAssignModal = (lead) => {
    setSelectedLead(lead);
    setModalOpen(true);
  };

  const handleAssigned = () => {
    fetchLeads();
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">All Team Leads</h2>
      <LeadList leads={leads} onUpdateLead={handleUpdateLead} onAssignLead={openAssignModal} />
      {selectedLead && (
        <AssignLeadModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          lead={selectedLead}
          onAssigned={handleAssigned}
        />
      )}
    </div>
  );
};

export default AllLeads;
