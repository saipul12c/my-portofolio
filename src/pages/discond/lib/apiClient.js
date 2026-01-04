// Lightweight API client for discond features
const BASE = '/api/discond';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    ...options,
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json().catch(() => null);
}

export const DiscondAPI = {
  getServer(id) { return request(`/servers/${id}`); },
  listChannels(serverId) { return request(`/servers/${serverId}/channels`); },
  postMessage(channelId, body) { return request(`/channels/${channelId}/messages`, { method: 'POST', body: JSON.stringify(body) }); },
  reactMessage(messageId, reaction) { return request(`/messages/${messageId}/reactions`, { method: 'POST', body: JSON.stringify({ reaction }) }); },
  fetchThreads(channelId) { return request(`/channels/${channelId}/threads`); },
  searchMessages(q) { return request(`/search?q=${encodeURIComponent(q)}`); },
  createPoll(channelId, payload) { return request(`/channels/${channelId}/polls`, { method: 'POST', body: JSON.stringify(payload) }); },
  getAnalytics(serverId) { return request(`/servers/${serverId}/analytics`); },
};

export default DiscondAPI;
