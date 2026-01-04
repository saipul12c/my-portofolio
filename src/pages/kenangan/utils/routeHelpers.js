/**
 * Route helpers for gallery media routing
 * Centralizes route mapping logic to avoid duplication
 */

/**
 * Get the route path for a media item
 * @param {string} type - Media type (short, image, video, album)
 * @param {string|number} id - Media ID
 * @returns {string} - Full route path
 */
export const getMediaRoute = (type, id) => {
  const routes = {
    short: 'shorts',
    image: 'images',
    video: 'videos',
    album: 'albums'
  };
  
  const routeSegment = routes[type] || type;
  return `/gallery/${routeSegment}/${id}`;
};

/**
 * Get the plural form of media type for routes
 * @param {string} type - Media type
 * @returns {string} - Plural form
 */
export const getPluralMediaType = (type) => {
  const plurals = {
    short: 'shorts',
    image: 'images',
    video: 'videos',
    album: 'albums'
  };
  
  return plurals[type] || type;
};
