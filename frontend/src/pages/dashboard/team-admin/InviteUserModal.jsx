// src/pages/dashboard/team-admin/InviteUserModal.jsx
import React, { useState } from "react";
import api from "../../../api";
import DashboardLayout from "../../../components/DashboardLayout";


const InviteUserModal = ({ isOpen, onClose, teamId, onInviteSent }) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("teamMember");
  const [loading, setLoading] = useState(false);

  const handleSendInvite = async () => {
    setLoading(true);
    try {
      await api.post("/invites", { email, role, teamId });
      setEmail("");
      setRole("teamMember");
      onInviteSent();
      onClose();
    } catch (err) {
      console.error("❌ Failed to send invite:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-lg font-bold mb-4">Invite User</h2>
        <input
          type="email"
          placeholder="User Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border w-full mb-2 p-2 rounded"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="border w-full mb-4 p-2 rounded"
        >
          <option value="teamMember">Team Member</option>
          <option value="teamAdmin">Team Admin</option>
        </select>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
          <button
            onClick={handleSendInvite}
            className="px-4 py-2 bg-blue-600 text-white rounded"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Invite"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InviteUserModal;
