import React, { useState } from "react";

export default function InvitePanel({ user, onInvitesCreated }) {
  const [email, setEmail] = useState("");

  const handleInvite = async () => {
    if (!email) return;
    try {
      await fetch("/api/invites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("crm_token")}`,
        },
        body: JSON.stringify({ email, teamId: user.teamId }),
      });
      setEmail("");
      onInvitesCreated();
      alert("Invite sent!");
    } catch (err) {
      alert("Error sending invite: " + err.message);
    }
  };

  return (
    <div className="card invite-panel">
      <h4>Invite Team Member</h4>
      <input
        type="email"
        placeholder="Email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button className="btn btn-primary" onClick={handleInvite}>Send Invite</button>
    </div>
  );
}
