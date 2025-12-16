import React, { useEffect, useState } from "react";
import api from "../../../api";
import LeadTable from "../../../components/LeadTable";

export default function MyLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/leads").then(res => setLeads(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;

  return <LeadTable leads={leads} />;
}
