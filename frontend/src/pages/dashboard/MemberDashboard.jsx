import React, { useEffect, useState } from "react";
import axios from "axios";
import LeadCard from "./LeadCard";
import "./Dashboard.css";

export default function MemberDashboard({ user }) {
  const [leads, setLeads] = useState([]);
  const [activeTab, setActiveTab] = useState("pond");
  const token = localStorage.getItem("token");

  // =============================
  // FETCH LEADS
  // =============================
  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/leads`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setLeads(res.data || []);
    } catch (err) {
      console.error("Failed to fetch leads", err);
    }
  };

  // =============================
  // FILTER LOGIC (INTENTIONAL + SAFE)
  // =============================
  const pondLeads = leads.filter((lead) => {
    return lead.assignedTo === "POND";
  });

  const myLeads = leads.filter((lead) => {
    return lead.assignedTo === user.email;
  });

  // =============================
  // ADD LEAD (MEMBERS CAN ADD)
  // =============================
  const handleAddLead = async (leadData) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/leads`,
        {
          ...leadData,
          assignedTo: "POND",
          status: "New",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchLeads();
    } catch (err) {
      console.error("Failed to add lead", err);
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Member Dashboard</h1>

        <div className="dashboard-tabs">
          <button
            className={activeTab === "pond" ? "active" : ""}
            onClick={() => setActiveTab("pond")}
          >
            Lead Pond
          </button>

          <button
            className={activeTab === "myLeads" ? "active" : ""}
            onClick={() => setActiveTab("myLeads")}
          >
            My Leads
          </button>

          <button
            className={activeTab === "add" ? "active" : ""}
            onClick={() => setActiveTab("add")}
          >
            Add Lead
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        {activeTab === "pond" && (
          <>
            {pondLeads.length === 0 ? (
              <p className="empty-state">No leads in the pond.</p>
            ) : (
              pondLeads.map((lead) => (
                <LeadCard
                  key={lead._id}
                  lead={lead}
                  refreshLeads={fetchLeads}
                  userRole="member"
                />
              ))
            )}
          </>
        )}

        {activeTab === "myLeads" && (
          <>
            {myLeads.length === 0 ? (
              <p className="empty-state">You have no assigned leads.</p>
            ) : (
              myLeads.map((lead) => (
                <LeadCard
                  key={lead._id}
                  lead={lead}
                  refreshLeads={fetchLeads}
                  userRole="member"
                />
              ))
            )}
          </>
        )}

        {activeTab === "add" && (
          <div className="add-lead-form">
            <AddLeadForm onSubmit={handleAddLead} />
          </div>
        )}
      </div>
    </div>
  );
}

/* =============================
   SIMPLE ADD LEAD FORM
============================= */
function AddLeadForm({ onSubmit }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    setForm({ name: "", email: "", phone: "", notes: "" });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
      <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
      <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
      <textarea name="notes" placeholder="Notes" value={form.notes} onChange={handleChange} />
      <button type="submit">Add Lead</button>
    </form>
  );
}
