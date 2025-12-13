// Lightweight API client for streming pages
const defaultHeaders = (json = true) => {
  const h = {};
  if (json) h['Content-Type'] = 'application/json';
  const token = localStorage.getItem('token');
  if (token) h['Authorization'] = `Bearer ${token}`;
  return h;
};

async function request(path, opts = {}) {
  // Prefer cookie-based auth: include credentials so httpOnly cookies are sent.
  const headers = { ...(opts.headers || {}), ...(defaultHeaders(opts.json !== false)) };
  try {
    const res = await fetch(path, { ...opts, headers, credentials: 'include' });
    const text = await res.text();
    let data = null;
    try { data = text ? JSON.parse(text) : null; } catch { data = text; }
    if (!res.ok) throw { status: res.status, error: data?.error || (typeof data === 'string' ? data : 'Request failed') };
    return data;
  } catch (err) {
    // normalize error
    if (err && err.error) throw err;
    throw { error: err?.message || String(err) };
  }
}

export const videos = {
  // Use authoritative youtube_videos list (reflects server-side updates)
  list: (q) => request(`/api/youtube/videos${q ? `?q=${encodeURIComponent(q)}` : ''}`),
  get: (id) => request(`/api/youtube/videos/${id}`),
  comments: (id, page, per) => request(`/api/youtube/videos/${id}/comments${page ? `?page=${page}&per=${per||20}` : ''}`),
  postComment: (id, author, message) => request(`/api/youtube/videos/${id}/comments`, { method: 'POST', body: JSON.stringify({ author, message }) })
  ,
  like: (id, liked) => request(`/api/videos/${id}/like`, { method: 'POST', body: JSON.stringify({ liked }) })
};

export const shorts = {
  list: () => request('/api/shorts')
};

export const streamingUsers = {
  list: () => request('/api/streaming-users')
};

export const streams = {
  listLive: () => request('/api/youtube/live'),
  start: (payload) => request('/api/streams/start', { method: 'POST', body: JSON.stringify(payload) })
};

export default { request, videos, shorts, streamingUsers, streams };
