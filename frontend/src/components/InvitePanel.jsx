import React, { useState } from "react";

export default function InvitePanel({ user, onInvitesCreated }) {
  const [email, setEmail] = useState("");

  const handleInvite = async () => {
    const token = localStorage.getItem("crm_token");
    try {
      const res = await fetch("https://crm-idx-backend.onrender.com/api/invites", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error(await res.text());
      setEmail("");
      onInvitesCreated();
    } catch (err) {
      alert("Failed to send invite: " + err.message);
    }
  };

  return (
    <div className="card" style={{ marginTop: 12 }}>
      <h4>Invite Agent</h4>
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Agent Email" className="input" />
      <button onClick={handleInvite} className="btn btn-secondary" style={{ marginTop: 8 }}>Send Invite</button>
    </div>
  );
}
