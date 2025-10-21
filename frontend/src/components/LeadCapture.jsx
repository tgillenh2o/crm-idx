import React, { useState } from 'react';
import { leads } from '../api';

export default function LeadCapture({ teamId }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });

  async function submit(e) {
    e.preventDefault();
    try {
      await leads.capture({ ...form, teamId });
      alert('Lead captured');
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      alert('Error capturing lead');
    }
  }

  return (
    <div className="card">
      <form onSubmit={submit}>
        <input className="input" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <div style={{ height: 8 }} />
        <input className="input" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        <div style={{ height: 8 }} />
        <input className="input" placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
        <div style={{ height: 8 }} />
        <textarea className="input" placeholder="Message" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
        <div style={{ height: 8 }} />
        <button className="btn btn-primary" type="submit">Send</button>
      </form>
    </div>
  );
}
