import React, { useEffect, useState } from "react";
import api from "../../../api";

export default function IndependentMyLeads() {
  const [leads, setLeads] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await api.get("/leads");
        setLeads(res.data || []);
      } catch (err) {
        setError("Failed to load leads");
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, []);

  return (
    <div style={pageStyle}>
      <header style={headerStyle}>
        <h1 style={{ margin: 0, color: "white" }}>Independent Dashboard</h1>
        <a href="/login" style={logoutStyle}>Logout</a>
      </header>

      <div style={cardStyle}>
        <h2 style={{ marginBottom: "15px", color: "#111" }}>My Leads</h2>

        {loading ? (
          <p>Loading leads...</p>
        ) : error ? (
          <div style={errorStyle}>{error}</div>
        ) : leads.length === 0 ? (
          <p>No leads found.</p>
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Type</th>
                <th style={thStyle}>Status</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead._id}>
                  <td style={tdStyle}>{lead.name}</td>
                  <td style={tdStyle}>{lead.email}</td>
                  <td style={tdStyle}>{lead.type}</td>
                  <td style={tdStyle}>{lead.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

const pageStyle = {
  background: "linear-gradient(135deg, #0f172a, #1e293b)",
  minHeight: "100vh",
  padding: "0",
  margin: "0",
  fontFamily: "Arial, sans-serif",
};

const headerStyle = {
  background: "#1e40af",
  color: "white",
  padding: "20px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
};

const logoutStyle = {
  color: "white",
  textDecoration: "none",
  background: "#dc2626",
  padding: "8px 12px",
  borderRadius: "6px",
  fontWeight: "bold",
};

const cardStyle = {
  background: "white",
  margin: "40px auto",
  borderRadius: "10px",
  padding: "30px",
  width: "90%",
  maxWidth: "900px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
};

const errorStyle = {
  background: "#fee2e2",
  color: "#b91c1c",
  padding: "10px",
  borderRadius: "6px",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "10px",
};

const thStyle = {
  textAlign: "left",
  background: "#f3f4f6",
  padding: "10px",
  borderBottom: "1px solid #ddd",
};

const tdStyle = {
  padding: "10px",
  borderBottom: "1px solid #eee",
};
