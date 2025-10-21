import React, { useState } from 'react';
import { invites } from '../api';

export default function InvitePanel({ user, onInvitesCreated }) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('agent');

  async function createInvite(e) {
    e.preventDefault();
    if (!user?.team) return alert('You must be part of a team to invite');
    try {
      const res = await invites.create({ email, teamId: user.team, role });
      alert('Invite created. Link: ' + res.data.inviteLink);
      setEmail('');
      onInvitesCreated && onInvitesCreated();
    } catch (err) {
      alert('Error creating invite');
    }
  }

  return (
    <div className="card" style={{ marginTop: 8 }}>
      <h4>Invite Member</h4>
      <form onSubmit={createInvite}>
        <input className="input" value={email} onChange={e => setEmail(e.target.value)} placeholder="email" />
        <div style={{ height: 8 }} />
        <select className="input" value={role} onChange={e => setRole(e.target.value)}>
          <option value="agent">Agent</option>
          <option value="teamAdmin">Team Admin</option>
        </select>
        <div style={{ height: 8 }} />
        <button className="btn btn-primary" type="submit">Create Invite</button>
      </form>
    </div>
  );
}
