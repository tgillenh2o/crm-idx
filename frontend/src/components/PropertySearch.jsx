import React, { useState } from 'react';
import { properties } from '../api';

export default function PropertySearch({ onResults }) {
  const [city, setCity] = useState('');
  const [minPrice, setMinPrice] = useState('');

  async function search(e) {
    e.preventDefault();
    try {
      const res = await properties.list({ city: city || undefined, minPrice: minPrice || undefined });
      onResults && onResults(res.data);
    } catch (err) {
      alert('Search error');
    }
  }

  return (
    <form onSubmit={search} style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <input className="input" placeholder="City" value={city} onChange={e => setCity(e.target.value)} />
        <input className="input" placeholder="Min price" type="number" value={minPrice} onChange={e => setMinPrice(e.target.value)} style={{ width: 140 }} />
        <button className="btn btn-primary" type="submit">Search</button>
      </div>
    </form>
  );
}
