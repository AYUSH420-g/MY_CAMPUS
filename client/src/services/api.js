// Dynamically determine API URL:
// 1. In production with VITE_API_URL set (e.g. https://my-backend.onrender.com), point to it
// 2. Otherwise default to relative '/api' (handled by Vite proxy locally or fullstack server)
const rawBase = import.meta.env.VITE_API_URL || '';
const cleanBase = rawBase.replace(/\/+$/, '');
const BASE_URL = cleanBase
  ? (cleanBase.endsWith('/api') ? cleanBase : `${cleanBase}/api`)
  : '/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('cc_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || `Request failed with status ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  // Authentication
  auth: {
    login: (credentials) =>
      request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),
    register: (userData) =>
      request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      }),
    me: () => request('/auth/me'),
    updateProfile: (data) =>
      request('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
  },

  // Marketplace
  marketplace: {
    getAll: (params = {}) => {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          searchParams.append(key, val);
        }
      });
      return request(`/marketplace?${searchParams.toString()}`);
    },
    getById: (id) => request(`/marketplace/${id}`),
    create: (data) =>
      request('/marketplace', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id, data) =>
      request(`/marketplace/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id) =>
      request(`/marketplace/${id}`, {
        method: 'DELETE',
      }),
    getMyListings: () => request('/marketplace/my/listings'),
  },

  // Lost & Found
  lostFound: {
    getAll: (params = {}) => {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          searchParams.append(key, val);
        }
      });
      return request(`/lost-found?${searchParams.toString()}`);
    },
    getById: (id) => request(`/lost-found/${id}`),
    create: (data) =>
      request('/lost-found', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    getMatches: (id, params = {}) => {
      const searchParams = new URLSearchParams(params);
      return request(`/lost-found/${id}/matches?${searchParams.toString()}`);
    },
    resolveMatch: (id, data) =>
      request(`/lost-found/${id}/resolve`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    getMyReports: () => request('/lost-found/my/reports'),
  },

  // Platform Stats
  stats: {
    get: () => request('/stats'),
  },
};
