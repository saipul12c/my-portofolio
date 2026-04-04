/**
 * Backend utility for legacy API support.
 * Refactored to handle Supabase migration or mock responses.
 */

export const apiFetch = async (path, options = {}) => {
  const url = `${import.meta.env.VITE_API_URL || ''}${path}`;
  
  try {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!res.ok) {
      if (res.status === 401) {
        throw new Error('Unauthorized');
      }
      throw new Error(`API Error: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

/**
 * Basic health check for the backend.
 * @param {number} timeout - Timeout in milliseconds.
 */
export const checkHealth = async (timeout = 3000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/health`, {
      signal: controller.signal,
    });
    clearTimeout(id);
    return res.ok;
  } catch (err) {
    clearTimeout(id);
    return false;
  }
};

export default { apiFetch, checkHealth };
