import "./LeadCard.css";

export default function LeadCard({
  lead,
  onUpdate,
  onClose,
  isAdmin,
  users,
  currentUserEmail
}) {
  const headers = {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json"
  };

  const api = path =>
    `${import.meta.env.VITE_API_URL}/api/leads/${lead._id}${path}`;

  const patch = async (path, body) => {
    const res = await fetch(api(path), {
      method: "PATCH",
      headers,
      body: body ? JSON.stringify(body) : null
    });
    onUpdate(await res.json());
  };

  return (
    <div className="lead-modal">
      <div className="lead-card dark">
        <h2>{lead.name}</h2>
        <p>{lead.email}</p>
        <p>{lead.phone}</p>

        <select
          value={lead.status}
          onChange={e => patch("/status", { status: e.target.value })}
        >
          <option>New</option>
          <option>Contacted</option>
          <option>Follow-up</option>
          <option>Under Contract</option>
          <option>Closed</option>
        </select>

        {lead.assignedTo === "POND" && (
          <button className="claim-button" onClick={() => patch("/claim")}>
            Claim Lead
          </button>
        )}

        {lead.assignedTo === currentUserEmail && (
          <button className="return-button" onClick={() => patch("/return")}>
            Return to Pond
          </button>
        )}

        {isAdmin && (
          <select onChange={e => patch("/reassign", { assignedTo: e.target.value })}>
            <option value="">Reassign</option>
            {users.map(u => (
              <option key={u._id} value={u.email}>{u.name}</option>
            ))}
          </select>
        )}

        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
