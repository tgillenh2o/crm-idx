import React, { useEffect, useState } from "react";
import "./LeadCard.css";

export default function LeadCard({
  lead,
  isAdmin,
  users = [],
  currentUserEmail,
  onUpdate,
  onClose,
}) {
  const [localLead, setLocalLead] = useState({ ...lead });
  const [editing, setEditing] = useState(false);
  const [newInteraction, setNewInteraction] = useState("");
  const [flash, setFlash] = useState("");

  /* ================= SYNC ================= */
  useEffect(() => {
    setLocalLead({ ...lead });
  }, [lead]);

  const triggerFlash = () => {
    setFlash(isAdmin ? "flash-admin" : "flash-member");
    setTimeout(() => setFlash(""), 700);
  };

  /* ================= API SAVE ================= */
  const saveLead = async updated => {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/leads/${updated._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(updated),
      }
    );

    const saved = await res.json();
    setLocalLead(saved);
    onUpdate(saved);
    triggerFlash();
  };

  /* ================= ACTIONS ================= */
  const handleStatusChange = e =>
    saveLead({ ...localLead, status: e.target.value || "New" });

  const handleChange = e =>
    setLocalLead({ ...localLead, [e.target.name]: e.target.value });

  const handleSave = () => {
    saveLead({ ...localLead, status: localLead.status || "New" });
    setEditing(false);
  };

  const handleClaim = e => {
    e.stopPropagation();
    saveLead({ ...localLead, assignedTo: currentUserEmail });
  };

  const handleReturnToPond = e => {
    e.stopPropagation();
    saveLead({ ...localLead, assignedTo: "" });
  };

  const handleReassign = (e, email) => {
    e.stopPropagation();
    saveLead({ ...localLead, assignedTo: email });
  };

  const handleDelete = async e => {
    e.stopPropagation();
    if (!window.confirm("Delete this lead permanently?")) return;

    await fetch(
      `${import.meta.env.VITE_API_URL}/api/leads/
