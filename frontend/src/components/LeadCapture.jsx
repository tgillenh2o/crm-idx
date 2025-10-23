import React, { useState } from "react";

export default function LeadCapture({ teamId }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const handleCapture = async () => {
    const token = localStorage.getItem("crm_token");
    try {
      const res = await fetch("https://crm-idx-backend.onrender.com/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name, email, phone, team: teamId }),
      });
      if (!res.ok) throw new Error(await res.text());
      setName(""); setEmail(""); setPhone("");
      alert("Lead captured!");
    } catch (err) {
      alert("Failed to capture lead: " + err.message);
    }
  };

  return (
    <div className="card" style={{ marginTop: 8 }}>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="input" />
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="input" />
      <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" className="input" />
      <button onClick={handleCapture} className="btn btn-primary" style={{ marginTop: 8 }}>Capture Lead</button>
    </div>
  );
}
