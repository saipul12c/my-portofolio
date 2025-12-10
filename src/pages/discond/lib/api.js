// Lightweight API client helpers for discond
// Use relative paths so it works when frontend is served by backend or via proxy in dev
import { friendlyFetchError } from '../utils/helpers';

const defaultHeaders = (json = true, token) => {
  const h = {};
  if (json) h['Content-Type'] = 'application/json';
  if (token) h['Authorization'] = `Bearer ${token}`;
  return h;
}

async function request(path, opts = {}) {
  const token = localStorage.getItem('token');
  const headers = { ...(opts.headers || {}), ...(defaultHeaders(opts.json !== false, token)) };
  try {
    const res = await fetch(path, { ...opts, headers });
    const text = await res.text();
    let data = null;
    try { data = text ? JSON.parse(text) : null; } catch { data = text; }
    if (!res.ok) return Promise.reject({ error: data?.error || friendlyFetchError(null, res), status: res.status, raw: data });
    return data;
  } catch (err) {
    return Promise.reject({ error: friendlyFetchError(err), raw: err });
  }
}

export const auth = {
  me: () => request('/api/auth/me'),
  signIn: (email, password) => request('/api/auth/signin', { method: 'POST', body: JSON.stringify({ email, password }) }),
  signUp: (email, password, username) => request('/api/auth/signup', { method: 'POST', body: JSON.stringify({ email, password, username }) })
};

export const channels = {
  list: (server_id) => request(`/api/channels${server_id ? `?server_id=${server_id}` : ''}`),
  active: (limit = 10) => request(`/api/channels/active?limit=${limit}`),
  create: (payload) => request('/api/channels', { method: 'POST', body: JSON.stringify(payload) }),
  rename: (id, name) => request(`/api/channels/${id}/rename`, { method: 'POST', body: JSON.stringify({ name }) })
};

// Local settings helpers for channels (frontend-only, persisted to localStorage)
channels.settings = {
  key: (channelId) => `discond:channel:settings:${channelId}`,
  // Try to fetch settings from backend endpoint first, fallback to localStorage
  get: async (channelId) => {
    try {
      // try server-side GET /api/channels/:id/settings
      const data = await request(`/api/channels/${channelId}/settings`).catch(() => null);
      if (data) return data;
    } catch (e) { /* ignore */ }
    try {
      const raw = localStorage.getItem(channels.settings.key(channelId));
      return raw ? JSON.parse(raw) : { muted: false, pinned_ids: [] };
    } catch (e) { return { muted: false, pinned_ids: [] }; }
  },
  // Try to persist to backend (PUT), fallback to localStorage
  set: async (channelId, payload) => {
    try {
      // attempt server-side save
      const res = await request(`/api/channels/${channelId}/settings`, { method: 'PUT', body: JSON.stringify(payload) }).catch(() => null);
      if (res) return res;
    } catch (e) { /* ignore */ }
    try {
      localStorage.setItem(channels.settings.key(channelId), JSON.stringify(payload || {}));
      return Promise.resolve(payload || {});
    } catch (e) { return Promise.reject(e); }
  }
};

export const messages = {
  list: (channel_id) => request(`/api/messages?channel_id=${channel_id}`),
  send: (channel_id, user_id, content) => request('/api/messages', { method: 'POST', body: JSON.stringify({ channel_id, user_id, content }) }),
  edit: (id, content) => request(`/api/messages/${id}`, { method: 'PATCH', body: JSON.stringify({ content }) }),
  delete: (id) => request(`/api/messages/${id}`, { method: 'DELETE' })
};

// Message pin/unpin helpers (server if available, otherwise frontend-managed)
messages.updatePinned = (id, pinned) => request(`/api/messages/${id}`, { method: 'PATCH', body: JSON.stringify({ pinned }) });
messages.pin = (id) => messages.updatePinned(id, true);
messages.unpin = (id) => messages.updatePinned(id, false);

export const users = {
  list: (q) => request(`/api/users${q ? `?q=${encodeURIComponent(q)}` : ''}`),
  get: (id) => request(`/api/users/${id}`),
  updateAvatar: (id, avatar_url) => request(`/api/users/${id}/avatar`, { method: 'POST', body: JSON.stringify({ avatar_url }) })
};

export const communities = {
  list: () => request('/api/communities'),
  get: (id) => request(`/api/communities/${id}`),
  create: (payload) => request('/api/communities', { method: 'POST', body: JSON.stringify(payload) })
};

export const servers = {
  list: () => request('/api/servers')
};

export const search = (q) => request(`/api/search?q=${encodeURIComponent(q)}`);

export const siteStats = () => request('/api/stats');

export const accountTiers = {
  list: () => request('/api/account-tiers'),
  create: (payload) => request('/api/account-tiers', { method: 'POST', body: JSON.stringify(payload) }),
  update: (id, payload) => request(`/api/account-tiers/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  delete: (id) => request(`/api/account-tiers/${id}`, { method: 'DELETE' })
};

export const bots = {
  list: () => request('/api/bots'),
  create: (payload) => request('/api/bots', { method: 'POST', body: JSON.stringify(payload) }),
  delete: (id) => request(`/api/bots/${id}`, { method: 'DELETE' }),
  send: (id, channel_id, content) => request(`/api/bots/${id}/send`, { method: 'POST', body: JSON.stringify({ channel_id, content }) })
};

export const channelHelpers = {
  summary: (id) => request(`/api/channels/${id}/summary`),
  stats: (server_id) => request(`/api/channels/stats${server_id ? `?server_id=${server_id}` : ''}`)
};

export default { request, auth, channels, messages, users, communities, servers, search, siteStats, accountTiers, bots, channelHelpers };
