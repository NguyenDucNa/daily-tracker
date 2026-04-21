const API_URL = import.meta.env.VITE_API_URL || 'https://daily-tracker-jvmk.onrender.com/api';

const getHeaders = async () => {
  const token = localStorage.getItem('firebaseToken');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

export const api = {
  auth: {
    login: async (email, password) => {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      return res.json();
    },
    register: async (email, password, displayName) => {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, displayName }),
      });
      return res.json();
    },
  },

  foods: {
    get: async (date) => {
      const headers = await getHeaders();
      const res = await fetch(`${API_URL}/foods?date=${date}`, { headers });
      return res.json();
    },
    create: async (food) => {
      const headers = await getHeaders();
      const res = await fetch(`${API_URL}/foods`, {
        method: 'POST',
        headers,
        body: JSON.stringify(food),
      });
      return res.json();
    },
    update: async (id, food) => {
      const headers = await getHeaders();
      const res = await fetch(`${API_URL}/foods/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(food),
      });
      return res.json();
    },
    delete: async (id) => {
      const headers = await getHeaders();
      const res = await fetch(`${API_URL}/foods/${id}`, {
        method: 'DELETE',
        headers,
      });
      return res.json();
    },
  },

  workouts: {
    get: async (date) => {
      const headers = await getHeaders();
      const res = await fetch(`${API_URL}/workouts?date=${date}`, { headers });
      return res.json();
    },
    getAll: async () => {
      const headers = await getHeaders();
      const res = await fetch(`${API_URL}/workouts/all`, { headers });
      return res.json();
    },
    getPRs: async () => {
      const headers = await getHeaders();
      const res = await fetch(`${API_URL}/workouts/personal-records`, { headers });
      return res.json();
    },
    create: async (workout) => {
      const headers = await getHeaders();
      const res = await fetch(`${API_URL}/workouts`, {
        method: 'POST',
        headers,
        body: JSON.stringify(workout),
      });
      return res.json();
    },
    delete: async (id) => {
      const headers = await getHeaders();
      const res = await fetch(`${API_URL}/workouts/${id}`, {
        method: 'DELETE',
        headers,
      });
      return res.json();
    },
  },

  sleep: {
    get: async (date) => {
      const headers = await getHeaders();
      const res = await fetch(`${API_URL}/sleep?date=${date}`, { headers });
      return res.json();
    },
    getStats: async () => {
      const headers = await getHeaders();
      const res = await fetch(`${API_URL}/sleep/stats`, { headers });
      return res.json();
    },
    create: async (sleep) => {
      const headers = await getHeaders();
      const res = await fetch(`${API_URL}/sleep`, {
        method: 'POST',
        headers,
        body: JSON.stringify(sleep),
      });
      return res.json();
    },
    delete: async (id) => {
      const headers = await getHeaders();
      const res = await fetch(`${API_URL}/sleep/${id}`, {
        method: 'DELETE',
        headers,
      });
      return res.json();
    },
  },

  groups: {
    create: async (name, displayName) => {
      const headers = await getHeaders();
      const res = await fetch(`${API_URL}/groups`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ name, displayName }),
      });
      return res.json();
    },
    getAll: async () => {
      const headers = await getHeaders();
      const res = await fetch(`${API_URL}/groups`, { headers });
      return res.json();
    },
    get: async (id) => {
      const headers = await getHeaders();
      const res = await fetch(`${API_URL}/groups/${id}`, { headers });
      return res.json();
    },
    update: async (id, name) => {
      const headers = await getHeaders();
      const res = await fetch(`${API_URL}/groups/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ name }),
      });
      return res.json();
    },
    delete: async (id) => {
      const headers = await getHeaders();
      const res = await fetch(`${API_URL}/groups/${id}`, {
        method: 'DELETE',
        headers,
      });
      return res.json();
    },
    join: async (inviteCode, displayName) => {
      const headers = await getHeaders();
      const res = await fetch(`${API_URL}/groups/join`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ inviteCode, displayName }),
      });
      return res.json();
    },
    leave: async (id) => {
      const headers = await getHeaders();
      const res = await fetch(`${API_URL}/groups/${id}/leave`, {
        method: 'POST',
        headers,
      });
      return res.json();
    },
    suggest: async (id) => {
      const headers = await getHeaders();
      const res = await fetch(`${API_URL}/groups/${id}/suggest`, { headers });
      return res.json();
    },
  },

  availability: {
    get: async () => {
      const headers = await getHeaders();
      const res = await fetch(`${API_URL}/availability`, { headers });
      return res.json();
    },
    set: async (availability) => {
      const headers = await getHeaders();
      const res = await fetch(`${API_URL}/availability`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ availability }),
      });
      return res.json();
    },
  },
};