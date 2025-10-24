import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Confirm() {
  const { token } = useParams();
  const [message, setMessage] = useState("Confirming...");

  useEffect(() => {
    fetch(`https://crm-idx.onrender.com/api/auth/confirm/${token}`)
      .then(r => r.text())
      .then(msg => setMessage(msg))
      .catch(() => setMessage("Confirmation failed"));
  }, [token]);

  return <div>{message}</div>;
}
