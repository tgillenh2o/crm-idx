// src/api.js

// Fetch list of teams
export const fetchTeams = () => {
  return fetch('/api/teams')
    .then(res => {
      if (!res.ok) {
        throw new Error(`Error fetching teams: ${res.status} ${res.statusText}`);
      }
      return res.json();
    });
};

// Fetch list of agents
export const fetchAgents = () => {
  return fetch('/api/agents')
    .then(res => {
      if (!res.ok) {
        throw new Error(`Error fetching agents: ${res.status} ${res.statusText}`);
      }
      return res.json();
    });
};

// Fetch list of admins
export const fetchAdmins = () => {
  return fetch('/api/admins')
    .then(res => {
      if (!res.ok) {
        throw new Error(`Error fetching admins: ${res.status} ${res.statusText}`);
      }
      return res.json();
    });
};