import { useEffect, useState } from "react";
import api from "../../api";
import LeadCard from "../../components/LeadCard";

export default function MemberDashboard() {
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    api.get("/leads/mine").then((res) => setLeads(res.data));
  }, []);

  return (
    <>
      <h1>My Leads</h1>
      {leads.map((lead) => (
        <LeadCard key={lead._id} lead={lead} />
      ))}
    </>
  );
}
