// Lightweight API client helpers for discond
// Use relative paths so it works when frontend is served by backend or via proxy in dev
import { friendlyFetchError } from '../utils/helpers';

const defaultHeaders = (json = true, token) => {
  const h = {};
  if (json) h['Content-Type'] = 'application/json';
  if (token) h['Authorization'] = `Bearer ${token}`;
  return h;
}
export const discord = {
  servers: {
    list: () => request('/api/discord/servers'),
    create: (payload) => request('/api/discord/servers', { method: 'POST', body: JSON.stringify(payload) }),
    get: (id) => request(`/api/discord/servers/${id}`)
  },
  invites: {
    create: (serverId, payload) => request(`/api/discord/servers/${serverId}/invite`, { method: 'POST', body: JSON.stringify(payload) }),
    list: (serverId) => request(`/api/discord/servers/${serverId}/invites`)
  },
  roles: {
    list: (server_id) => request(`/api/discord/roles${server_id ? `?server_id=${server_id}` : ''}`),
    create: (payload) => request('/api/discord/roles', { method: 'POST', body: JSON.stringify(payload) })
  },
  webhooks: {
    list: (server_id) => request(`/api/discord/webhooks${server_id ? `?server_id=${server_id}` : ''}`),
    create: (payload) => request('/api/discord/webhooks', { method: 'POST', body: JSON.stringify(payload) }),
    send: (id, payload) => request(`/api/discord/webhooks/${id}/send`, { method: 'POST', body: JSON.stringify(payload) })
  },
  presence: {
    get: (userId) => request(`/api/discord/presence/${userId}`),
    // prefer new backend /api/presence
    set: (userId, payload) => request('/api/presence', { method: 'POST', body: JSON.stringify({ user_id: userId, ...(payload || {}) }) })
  }
};

async function request(path, opts = {}) {
  // Use token-based auth when available (token stored in localStorage by Auth flows).
  // Still include credentials to support cookie-based setups when present.
  const token = (typeof localStorage !== 'undefined') ? localStorage.getItem('token') : null;
  const headers = { ...(opts.headers || {}), ...(defaultHeaders(opts.json !== false, token)) };
  try {
    const res = await fetch(path, { ...opts, headers, credentials: 'include' });
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
    // cache whether server exposes per-channel settings endpoint to avoid noisy repeated 404s
    if (channels.settings._hasEndpoint === false) {
      try { const raw = localStorage.getItem(channels.settings.key(channelId)); return raw ? JSON.parse(raw) : { muted: false, pinned_ids: [] }; } catch { return { muted: false, pinned_ids: [] }; }
    }
    try {
      // try server-side GET /api/channels/:id/settings
      const data = await request(`/api/channels/${channelId}/settings`);
      // if succeeds, mark endpoint available
      channels.settings._hasEndpoint = true;
      if (data) return data;
    } catch (err) {
      // if backend replies 404 for this endpoint, cache negative result to avoid further requests
      try {
        if (err && err.status === 404) channels.settings._hasEndpoint = false;
      } catch (e) { /* ignore */ }
      // fall through to local storage fallback
    }
    try {
      const raw = localStorage.getItem(channels.settings.key(channelId));
      return raw ? JSON.parse(raw) : { muted: false, pinned_ids: [] };
    } catch { return { muted: false, pinned_ids: [] }; }
  },
  // Try to persist to backend (PUT), fallback to localStorage
  set: async (channelId, payload) => {
    try {
      // attempt server-side save
      const res = await request(`/api/channels/${channelId}/settings`, { method: 'PUT', body: JSON.stringify(payload) }).catch(() => null);
      if (res) return res;
    } catch { /* ignore */ }
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

// add reaction helper
messages.react = (id, emoji, user_id) => request(`/api/messages/${id}/react`, { method: 'POST', body: JSON.stringify({ emoji, user_id }) });

// Message pin/unpin helpers (server if available, otherwise frontend-managed)
messages.updatePinned = (id, pinned) => request(`/api/messages/${id}`, { method: 'PATCH', body: JSON.stringify({ pinned }) });
messages.pin = (id) => messages.updatePinned(id, true);
messages.unpin = (id) => messages.updatePinned(id, false);

export const users = {
  list: (q) => request(`/api/users${q ? `?q=${encodeURIComponent(q)}` : ''}`),
  get: (id) => request(`/api/users/${id}`),
  updateAvatar: (id, avatar_url) => request(`/api/users/${id}/avatar`, { method: 'POST', body: JSON.stringify({ avatar_url }) })
};

// Profile helpers
export const profiles = {
  update: (id, payload) => request(`/api/profiles/${id}`, { method: 'PUT', body: JSON.stringify(payload) })
};

// Expose per-user messages
users.messages = {
  list: (userId) => request(`/api/users/${userId}/messages`)
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

// Uploads helper (multipart). Caller should use FormData and key 'file'
export const uploads = {
  upload: (formData) => {
    const token = localStorage.getItem('token');
    return fetch('/api/uploads', { method: 'POST', body: formData, headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) } }).then(async (res) => {
      const txt = await res.text();
      try { const data = txt ? JSON.parse(txt) : null; if (!res.ok) return Promise.reject({ error: data?.error || 'Upload failed', status: res.status, raw: data }); return data; } catch (e) { if (!res.ok) return Promise.reject({ error: 'Upload failed', status: res.status, raw: txt }); return txt; }
    }).catch(err => Promise.reject({ error: friendlyFetchError(err), raw: err }));
  }
};

// Channel subchannels (server-side when available)
channels.subchannels = {
  create: (channelId, name, position) => request(`/api/channels/${channelId}/subchannels`, { method: 'POST', body: JSON.stringify({ name, position }) }),
  delete: (channelId, subId) => request(`/api/channels/${channelId}/subchannels/${subId}`, { method: 'DELETE' }),
  rename: (channelId, subId, name) => request(`/api/channels/${channelId}/subchannels/${subId}/rename`, { method: 'POST', body: JSON.stringify({ name }) })
};

export const ai = {
  chat: (payload) => request('/api/ai/chat', { method: 'POST', body: JSON.stringify(payload) }),
  summarize: (text) => request('/api/ai/summarize', { method: 'POST', body: JSON.stringify({ text }) }),
  moderate: (input) => request('/api/ai/moderate', { method: 'POST', body: JSON.stringify({ input }) })
};

// Extra legacy auth convenience routes (registered at `/auth/*` by backend)
export const authAliases = {
  register: (email, password, username) => request('/auth/register', { method: 'POST', body: JSON.stringify({ email, password, username }) }),
  login: (email, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  refresh: (token) => request('/auth/refresh', { method: 'POST', body: JSON.stringify({ token }) }),
  forgotPassword: (email) => request('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
  resetPassword: (token, new_password) => request('/auth/reset-password', { method: 'POST', body: JSON.stringify({ token, new_password }) }),
  verifyEmail: (token) => request('/auth/verify-email', { method: 'POST', body: JSON.stringify({ token }) }),
  enable2fa: (payload) => request('/auth/enable-2fa', { method: 'POST', body: JSON.stringify(payload || {}) }),
  disable2fa: (payload) => request('/auth/disable-2fa', { method: 'POST', body: JSON.stringify(payload || {}) })
};

// Friends / DM / Blocks / non-API servers (convenience endpoints)
export const friends = {
  request: (user_id) => request('/friends/request', { method: 'POST', body: JSON.stringify({ user_id }) }),
  accept: (payload) => request('/friends/accept', { method: 'POST', body: JSON.stringify(payload) }),
  reject: (payload) => request('/friends/reject', { method: 'POST', body: JSON.stringify(payload) }),
  remove: (id) => request(`/friends/${id}`, { method: 'DELETE' }),
  list: () => request('/friends/list')
};

export const dm = {
  create: (payload) => request('/dm/create', { method: 'POST', body: JSON.stringify(payload) }),
  messages: {
    list: (dmId) => request(`/dm/${dmId}/messages`),
    post: (dmId, payload) => request(`/dm/${dmId}/messages`, { method: 'POST', body: JSON.stringify(payload) })
  },
  typing: (dmId, payload) => request(`/dm/${dmId}/typing`, { method: 'POST', body: JSON.stringify(payload) })
};

export const blocks = {
  set: (id, payload) => request(`/blocks/${id}`, { method: 'POST', body: JSON.stringify(payload || {}) })
};

export const serversAdmin = {
  create: (payload) => request('/servers', { method: 'POST', body: JSON.stringify(payload) }),
  list: () => request('/servers'),
  get: (id) => request(`/servers/${id}`),
  update: (id, payload) => request(`/servers/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  delete: (id) => request(`/servers/${id}`, { method: 'DELETE' })
};

// Additional user convenience endpoints (non-/api)
users.mePreferences = () => request('/users/me/preferences');
users.updateMeProfile = (payload) => request('/users/me/profile', { method: 'PUT', body: JSON.stringify(payload) });
users.privacy = (id) => request(`/users/${id}/privacy`);
users.report = (id, payload) => request(`/users/${id}/report`, { method: 'POST', body: JSON.stringify(payload || {}) });
export default { request, auth, authAliases, channels, messages, users, profiles, communities, servers, serversAdmin, search, siteStats, accountTiers, bots, channelHelpers, discord, friends, dm, blocks, ai };
