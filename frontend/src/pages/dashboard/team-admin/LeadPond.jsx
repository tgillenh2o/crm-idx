// src/pages/dashboard/team-admin/LeadPond.jsx
import React, { useEffect, useState } from "react";
import api from "../../../api";
import LeadList from "../../../components/LeadList";
import AssignLeadModal from "./AssignLeadModal";

const LeadPond = () => {
  const [pondLeads, setPondLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchPond();
  }, []);

  const fetchPond = async () => {
    try {
      const res = await api.get("/leads/pond");
      setPondLeads(res.data.leads);
    } catch (err) {
      console.error("❌ Failed to fetch pond leads:", err);
    }
  };

  const openAssignModal = (lead) => {
    setSelectedLead(lead);
    setModalOpen(true);
  };

  const handleAssigned = () => {
    fetchPond();
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Lead Pond</h2>
      <LeadList leads={pondLeads} onAssignLead={openAssignModal} />
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

export default LeadPond;
