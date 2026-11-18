/**
 * Cache Manager for Stale-While-Revalidate Messaging
 * Provides instant 0ms startup by hydrating chat from local cache while
 * background sync fetches fresh data from Supabase.
 */

const CACHE_PREFIX = 'live_chat_cache_';

export const getCachedMessages = (channel = 'umum') => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(`${CACHE_PREFIX}${channel}`);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn('Failed to read cached messages:', err);
    return [];
  }
};

export const setCachedMessages = (channel = 'umum', messages = []) => {
  if (typeof window === 'undefined') return;
  try {
    // Only cache recent 40 messages to keep localStorage light (< 150KB)
    const toCache = messages.slice(0, 40);
    localStorage.setItem(`${CACHE_PREFIX}${channel}`, JSON.stringify(toCache));
  } catch (err) {
    console.warn('Failed to write cached messages:', err);
  }
};
