// src/pages/dashboard/team-admin/AssignLeadModal.jsx
import React, { useState, useEffect } from "react";
import api from "../../../api";

const AssignLeadModal = ({ isOpen, onClose, lead, onAssigned }) => {
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState("");

  useEffect(() => {
    if (isOpen) fetchMembers();
  }, [isOpen]);

  const fetchMembers = async () => {
    try {
      const res = await api.get("/teams/members");
      setMembers(res.data.members);
      setSelectedMember(res.data.members[0]?._id || "");
    } catch (err) {
      console.error("❌ Failed to fetch team members:", err);
    }
  };

  const handleAssign = async () => {
    if (!selectedMember) return;
    try {
      await api.put(`/leads/${lead._id}/assign`, { assignedTo: selectedMember });
      onAssigned();
      onClose();
    } catch (err) {
      console.error("❌ Failed to assign lead:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-lg font-bold mb-4">Assign Lead</h2>
        <p className="mb-2">{lead.firstName} {lead.lastName}</p>
        <select
          className="border rounded w-full mb-4 p-2"
          value={selectedMember}
          onChange={(e) => setSelectedMember(e.target.value)}
        >
          {members.map((member) => (
            <option key={member._id} value={member._id}>
              {member.name}
            </option>
          ))}
        </select>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded border border-gray-400">Cancel</button>
          <button onClick={handleAssign} className="px-4 py-2 rounded bg-blue-600 text-white">Assign</button>
        </div>
      </div>
    </div>
  );
};

export default AssignLeadModal;
