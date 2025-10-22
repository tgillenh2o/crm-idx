import React, { useEffect, useState } from "react";
import { auth, teams, properties, setAuthToken, invites, leads } from "./api";
import TeamList from "./components/TeamList";
import TeamAdminPanel from "./components/TeamAdminPanel";
import InvitePanel from "./components/InvitePanel";
import LeadCapture from "./components/LeadCapture";
import PropertySearch from "./components/PropertySearch";
import PropertyList from "./components/PropertyList";
import AgentLeads from "./components/AgentLeads";

export default function App() {
  const [user, setUser] = useState(null);
  const [teamsData, setTeamsData] = useState([]);
  const [propertiesData, setPropertiesData] = useState([]);
  const [leadsData, setLeadsData] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("crm_user");
    const token = localStorage.getItem("crm_token");
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      setAuthToken(token);
      loadData();
    }
  }, []);

  async function loadData() {
    try {
      const [tRes, pRes, lRes] = await Promise.all([teams.list(), properties.list(), leads.list()]);
      setTeamsData(tRes.data || []);
      setPropertiesData(pRes.data || []);
      setLeadsData(lRes.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load data");
    }
  }

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const email = e.target.email.value;
      const password = e.target.password.value;
      const res = await auth.login({ email, password });
      setUser(res.user);
      localStorage.setItem("crm_user", JSON.stringify(res.user));
      localStorage.setItem("crm_token", res.token);
      setAuthToken(res.token);
      loadData();
    } catch (err) {
      alert("Login failed: " + err.message);
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    try {
      const name = e.target.name.value;
      const email = e.target.email.value;
      const password = e.target.password.value;
      const res = await auth.register({ name, email, password });
      setUser(res.user);
      localStorage.setItem("crm_user", JSON.stringify(res.user));
      localStorage.setItem("crm_token", res.token);
      setAuthToken(res.token);
      loadData();
    } catch (err) {
      alert("Registration failed: " + err.message);
    }
  }

  if (!user) {
    return (
      <div className="container" style={{ maxWidth: 400, margin: "auto" }}>
        <h2>Login</h2>
        <form onSubmit={handleLogin} className="card">
          <input name="email" placeholder="Email" className="input" />
          <input name="password" type="password" placeholder="Password" className="input" />
          <button type="submit" className="btn btn-primary">Login</button>
        </form>

        <h2>Register</h2>
        <form onSubmit={handleRegister} className="card">
          <input name="name" placeholder="Name" className="input" />
          <input name="email" placeholder="Email" className="input" />
          <input name="password" type="password" placeholder="Password" className="input" />
          <button type="submit" className="btn btn-secondary">Register</button>
        </form>
      </div>
    );
  }

  // Authenticated dashboard
  return (
    <div className="container">
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <div>
          <strong>{user.name}</strong> ({user.role})<br />
          <small>{user.email}</small>
        </div>
        <button onClick={() => { localStorage.clear(); setUser(null); setAuthToken(null); }} className="btn">Logout</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 16 }}>
        <div>
          <h3>Teams</h3>
          <TeamList teams={teamsData} />
          {user.role === "teamAdmin" && <TeamAdminPanel user={user} onTeamsUpdated={loadData} />}
          {user.role === "teamAdmin" && <InvitePanel user={user} onInvitesCreated={loadData} />}
        </div>

        <div>
          {user.role === "agent" && <AgentLeads leads={leadsData.filter(l => l.agent === user._id)} />}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <button className="btn btn-primary" onClick={() => properties.sync().then(loadData)}>Sync IDX</button>
            <small>Background worker auto-syncs every X minutes</small>
          </div>
          <PropertySearch onResults={setPropertiesData} />
          <PropertyList properties={propertiesData} />
          <div style={{ marginTop: 18 }}>
            <h3>Lead Capture</h3>
            {teamsData[0] ? <LeadCapture teamId={teamsData[0]._id} /> : <div className="card">Create a team to enable lead capture.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
