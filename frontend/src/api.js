import axios from 'axios';
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';
const client = axios.create({ baseURL: API_BASE });

export function setAuthToken(token) {
  client.defaults.headers.common['Authorization'] = token ? `Bearer ${token}` : '';
}

export const auth = {
  register: (payload) => client.post('/auth/register', payload),
  login: (payload) => client.post('/auth/login', payload),
};

export const teams = {
  list: () => client.get('/teams'),
  create: (payload) => client.post('/teams', payload),
  addMember: (teamId, userId) => client.post(`/teams/${teamId}/members`, { userId }),
};

export const properties = {
  list: (params) => client.get('/properties', { params }),
  sync: () => client.post('/properties/sync')
};

export const invites = {
  create: (payload) => client.post('/invites', payload),
  acceptInfo: (token) => client.get(`/invites/accept/${token}`),
  listForTeam: (teamId) => client.get(`/invites/team/${teamId}`)
};

export const leads = {
  capture: (payload) => client.post('/leads/capture', payload),
  listForTeam: (teamId) => client.get(`/leads/team/${teamId}`),
  update: (leadId, payload) => client.put(`/leads/${leadId}`, payload)
};
