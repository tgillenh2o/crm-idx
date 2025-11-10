import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";

const AcceptInvite = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("Verifying...");

  useEffect(() => {
    const accept = async () => {
      try {
        await api.get(`/invites/accept/${token}`);
        setStatus("Invite accepted! You can now log in.");
        setTimeout(() => navigate("/login"), 2000);
      } catch (err) {
        console.error(err);
        setStatus("Failed to accept invite. The link may be expired.");
      }
    };
    accept();
  }, [token, navigate]);

  return (
    <div className="flex justify-center items-center h-screen">
      <h2 className="text-xl">{status}</h2>
    </div>
  );
};

export default AcceptInvite;
