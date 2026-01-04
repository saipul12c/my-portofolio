/**
 * Gallery configuration constants
 * Centralizes magic numbers for better maintainability
 */

export const GALLERY_CONFIG = {
  // Pagination
  ITEMS_PER_PAGE: {
    SHORTS: 3,
    IMAGES: 10,
    VIDEOS: 9,
    ALBUMS: 9
  },
  
  MAX_PAGES_DISPLAY: 10,
  
  // Display limits
  VISIBLE_TAGS: 3,
  VISIBLE_COMMENTS: 3,
  
  // Infinite scroll
  INITIAL_VISIBLE_COUNT: 9,
  LOAD_MORE_COUNT: 6,
  SCROLL_THRESHOLD: 200,
  
  // LocalStorage
  STORAGE_KEYS: {
    SEARCH_HISTORY: 'myporto_gallery_search_history_v1',
    BOOKMARKS: 'myporto_gallery_bookmarks_v1'
  },
  
  MAX_HISTORY_ITEMS: 30,
  MAX_BOOKMARK_ITEMS: 40,
  
  // Debounce/Throttle
  SEARCH_DEBOUNCE_MS: 300,
  COPY_FEEDBACK_MS: 3000
};
