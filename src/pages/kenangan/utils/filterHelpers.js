/**
 * Shared filter utilities for gallery media
 * Reduces code duplication across components
 */

/**
 * Filter media items by search term and tags
 * @param {Array} items - Array of media items
 * @param {string} searchTerm - Search query
 * @param {Array} selectedTags - Array of selected tags
 * @returns {Array} - Filtered items
 */
export function filterMediaItems(items, searchTerm = '', selectedTags = []) {
  let filtered = items;

  // Filter by search term
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filtered = filtered.filter(item =>
      item.title?.toLowerCase().includes(term) ||
      item.desc?.toLowerCase().includes(term) ||
      item.category?.toLowerCase().includes(term) ||
      item.tags?.some(tag => tag.toLowerCase().includes(term))
    );
  }

  // Filter by tags
  if (selectedTags.length > 0) {
    filtered = filtered.filter(item =>
      selectedTags.some(tag => item.tags?.includes(tag))
    );
  }

  return filtered;
}

/**
 * Fisher-Yates shuffle algorithm
 * @param {Array} array - Array to shuffle
 * @returns {Array} - Shuffled array
 */
export function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
