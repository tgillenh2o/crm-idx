import React, { useState } from 'react';
import { teams } from '../api';

export default function TeamAdminPanel({ user, onTeamsUpdated }) {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');

  async function createTeam(e) {
    e.preventDefault();
    try {
      await teams.create({ name, slug, bio: '' });
      setName(''); setSlug('');
      onTeamsUpdated && onTeamsUpdated();
    } catch (err) {
      alert('Error creating team');
    }
  }

  return (
    <div className="card" style={{ marginTop: 8 }}>
      <h4>Team Admin</h4>
      <form onSubmit={createTeam}>
        <input className="input" value={name} onChange={e => setName(e.target.value)} placeholder="Team name" />
        <div style={{ height: 8 }} />
        <input className="input" value={slug} onChange={e => setSlug(e.target.value)} placeholder="slug" />
        <div style={{ height: 8 }} />
        <button className="btn btn-primary" type="submit">Create Team</button>
      </form>
    </div>
  );
}
