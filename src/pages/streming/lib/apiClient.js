// Lightweight API client for streming features
const BASE = '/api/streming';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    ...options,
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json().catch(() => null);
}

export const StreamingAPI = {
  getVideo(id) { return request(`/videos/${id}`); },
  getComments(videoId) { return request(`/videos/${videoId}/comments`); },
  postComment(videoId, body) { return request(`/videos/${videoId}/comments`, { method: 'POST', body: JSON.stringify(body) }); },
  createClip(videoId, payload) { return request(`/videos/${videoId}/clips`, { method: 'POST', body: JSON.stringify(payload) }); },
  getRecommendations(userId) { return request(`/users/${userId}/recommendations`); },
  getStats(videoId) { return request(`/videos/${videoId}/stats`); },
};

export default StreamingAPI;
