import React from 'react';

export default function TeamList({ teams = [] }) {
  if (!teams.length) return <div className="card">No teams yet.</div>;
  return (
    <div style={{ display: 'grid', gap: 8 }}>
      {teams.map(t => (
        <div key={t._id} className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <strong>{t.name}</strong>
              <div style={{ color: '#6b7280' }}>{t.bio}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 12 }}>Admin: {t.admin?.name || '—'}</div>
              <div style={{ fontSize: 12 }}>Members: {t.members?.length || 0}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
