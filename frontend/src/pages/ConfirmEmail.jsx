import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ConfirmEmail() {
  const { token } = useParams();
  const [status, setStatus] = useState("Confirming...");

  useEffect(() => {
    fetch(`https://crm-idx.onrender.com/api/auth/confirm/${token}`)
      .then((res) => res.text())
      .then((msg) => setStatus(msg))
      .catch(() => setStatus("Failed to confirm email."));
  }, [token]);

  return <div className="card confirm-email">{status}</div>;
}
