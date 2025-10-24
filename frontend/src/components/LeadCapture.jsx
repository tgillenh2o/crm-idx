import React, { useState } from "react";

export default function LeadCapture({ teamId }) {
  const [leadEmail, setLeadEmail] = useState("");
  const [leadName, setLeadName] = useState("");

  const handleCapture = async () => {
    if (!leadEmail || !leadName) return;
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("crm_token")}`,
        },
        body: JSON.stringify({ name: leadName, email: leadEmail, teamId }),
      });
      setLeadEmail("");
      setLeadName("");
      alert("Lead captured successfully!");
    } catch (err) {
      alert("Error capturing lead: " + err.message);
    }
  };

  return (
    <div className="card lead-capture">
      <h4>Lead Capture</h4>
      <input
        type="text"
        placeholder="Name"
        value={leadName}
        onChange={(e) => setLeadName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={leadEmail}
        onChange={(e) => setLeadEmail(e.target.value)}
      />
      <button className="btn btn-primary" onClick={handleCapture}>Capture Lead</button>
    </div>
  );
}
