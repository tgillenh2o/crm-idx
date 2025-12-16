import { useEffect, useState } from "react";
import api from "../api";

export default function LeadHistory({ leadId }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    api.get(`/leads/${leadId}/history`).then(res => setHistory(res.data));
  }, [leadId]);

  if (!history.length) return <p>No history available.</p>;

  return (
    <div>
      <h4>Lead Activity</h4>
      <ul>
        {history.map((h, idx) => (
          <li key={idx}>
            <strong>{h.by?.name || "Unknown"}</strong> — {h.action} (
            {new Date(h.timestamp).toLocaleString()})
          </li>
        ))}
      </ul>
    </div>
  );
}
