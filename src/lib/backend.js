// Small helper for backend interactions and health checks
export async function checkHealth(timeout = 3000) {
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    const res = await fetch('/api/health', { signal: controller.signal });
    clearTimeout(id);
    return res.ok;
  } catch (err) {
    return false;
  }
}

export async function apiFetch(url, opts) {
  const headers = { ...(opts && opts.headers ? opts.headers : {}) };

  // Automatically attach bearer token from localStorage when available
  try {
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
    if (token && !headers.Authorization && !headers.authorization) {
      headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    // ignore if localStorage isn't available in the environment
  }

  if (!headers['Content-Type'] && !(opts && opts.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(url, { ...(opts || {}), headers });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    const body = text ? (() => { try { return JSON.parse(text); } catch { return { message: text }; } })() : {};
    const err = new Error(body.error || body.message || `Request failed: ${res.status}`);
    err.status = res.status;
    err.body = body;
    throw err;
  }
  return res.json().catch(() => null);
}

export default { checkHealth, apiFetch };
