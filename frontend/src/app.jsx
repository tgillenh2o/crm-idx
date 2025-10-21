import React, { useEffect, useState } from 'react';
import { auth, teams, properties, setAuthToken, invites, leads } from './api';
import TeamList from './components/TeamList';
import TeamAdminPanel from './components/TeamAdminPanel';
import InvitePanel from './components/InvitePanel';
import LeadCapture from './components/LeadCapture';
import PropertySearch from './components/PropertySearch';
import PropertyList from './components/PropertyList';

export default function App() {
  const [user, setUser] = useState(null);
  const [teamsData, setTeamsData] = useState([]);
  const [propertiesData, setPropertiesData] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('crm_user');
    const token = localStorage.getItem('crm_token');
    if (stored && token) {
      setUser(JSON.parse(stored));
      setAuthToken(token);
      loadData();
    }
  }, []);

  async function loadData() {
    try {
      const [tRes, pRes] = await Promise.all([teams.list(), properties.list()]);
      setTeamsData(tRes.data);
      setPropertiesData(pRes.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const email = e.target.email.value;
      const password = e.target.password.value;
      const res = await auth.login({ email, password });
      setUser(res.data.user);
      localStorage.setItem('crm_user', JSON.stringify(res.data.user));
      localStorage.setItem('crm_token', res.data.token);
      setAuthToken(res.data.token);
      loadData();
    } catch (err) {
      alert('Login failed');
    }
  }

  return (
    <div className="container">
      <h1>CRM + IDX (cloud)</h1>
      {!user ? (
        <div style={{ maxWidth: 420 }}>
          <form onSubmit={handleLogin} className="card">
            <h3>Login</h3>
            <input name="email" className="input" placeholder="email" />
            <div style={{ height: 8 }} />
            <input name="password" type="password" className="input" placeholder="password" />
            <div style={{ height: 12 }} />
            <button className="btn btn-primary" type="submit">Login</button>
          </form>
        </div>
      ) : (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <div>
              <strong>{user.name}</strong> <small>({user.role})</small>
              <div style={{ color: '#6b7280' }}>{user.email}</div>
            </div>
            <div>
              <button onClick={() => { localStorage.clear(); setUser(null); setAuthToken(null); }} className="btn">Logout</button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16 }}>
            <div>
              <h3>Teams</h3>
              <TeamList teams={teamsData} />
              {user.role === 'teamAdmin' && <TeamAdminPanel user={user} onTeamsUpdated={loadData} />}
              {user.role === 'teamAdmin' && <InvitePanel user={user} onInvitesCreated={loadData} />}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button className="btn btn-primary" onClick={() => properties.sync().then(loadData)}>Sync IDX</button>
                <div style={{ color: '#6b7280' }}>Background worker auto-syncs every X minutes</div>
              </div>

              <PropertySearch onResults={setPropertiesData} />
              <PropertyList properties={propertiesData} />

              <div style={{ marginTop: 18 }}>
                <h3>Lead capture</h3>
                {teamsData[0] ? <LeadCapture teamId={teamsData[0]._id} /> : <div className="card">Create a team to enable lead capture.</div>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
