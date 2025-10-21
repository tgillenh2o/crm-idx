import React from 'react';

export default function PropertyList({ properties = [] }) {
  if (!properties.length) return <div className="card">No properties found.</div>;
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      {properties.map(p => (
        <div key={p._id || p.listingId} className="card" style={{ display: 'flex', gap: 12 }}>
          <div style={{ width: 140, height: 90, background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {p.photos && p.photos[0] ? <img src={p.photos[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : 'No image'}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600 }}>{p.title || p.address?.line}</div>
            <div style={{ color: '#6b7280' }}>{p.address?.city}, {p.address?.state} • ${p.price?.toLocaleString?.()}</div>
            <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 6 }}>Source: {p.source}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
