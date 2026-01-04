/**
 * Security utilities for sanitizing user inputs and URLs
 * Prevents XSS, injection attacks, and path traversal
 */

/**
 * Sanitize URL to prevent XSS attacks
 * @param {string} url - URL to sanitize
 * @param {string} fallback - Fallback URL if validation fails
 * @returns {string} - Safe URL or fallback
 */
export function sanitizeUrl(url, fallback = '/placeholder.jpg') {
  if (!url || typeof url !== 'string') return fallback;
  
  try {
    // Parse URL to validate structure
    const parsed = new URL(url, window.location.origin);
    
    // Only allow http, https, and data URLs (for base64 images)
    const allowedProtocols = ['http:', 'https:', 'data:'];
    if (!allowedProtocols.includes(parsed.protocol)) {
      console.warn('Invalid protocol:', parsed.protocol);
      return fallback;
    }
    
    // For data URLs, validate it's an image
    if (parsed.protocol === 'data:') {
      if (!url.startsWith('data:image/')) {
        console.warn('Invalid data URL - not an image');
        return fallback;
      }
    }
    
    return parsed.href;
  } catch (err) {
    console.warn('Invalid URL:', url, err.message);
    return fallback;
  }
}

/**
 * Sanitize video URL (stricter validation)
 * @param {string} url - Video URL to sanitize
 * @returns {string|null} - Safe URL or null
 */
export function sanitizeVideoUrl(url) {
  if (!url || typeof url !== 'string') return null;
  
  try {
    const parsed = new URL(url, window.location.origin);
    
    // Only allow http and https for videos
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return null;
    }
    
    // Validate video file extension
    const validExtensions = /\.(mp4|webm|ogg)$/i;
    if (!validExtensions.test(parsed.pathname)) {
      // Allow if no extension (could be streaming URL)
      const hasExtension = /\.[a-z0-9]+$/i.test(parsed.pathname);
      if (hasExtension) return null;
    }
    
    return parsed.href;
  } catch (err) {
    console.warn('Invalid video URL:', url, err.message);
    return null;
  }
}

/**
 * Sanitize string for storage (prevent XSS in localStorage)
 * @param {string} str - String to sanitize
 * @returns {string} - Sanitized string
 */
export function sanitizeForStorage(str) {
  if (typeof str !== 'string') return '';
  
  // Remove HTML tags and script content
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/[<>]/g, '')
    .trim()
    .substring(0, 500); // Limit length
}

/**
 * Sanitize object for localStorage (recursive)
 * @param {any} data - Data to sanitize
 * @returns {any} - Sanitized data
 */
export function sanitizeObjectForStorage(data) {
  if (typeof data === 'string') {
    return sanitizeForStorage(data);
  }
  
  if (Array.isArray(data)) {
    return data.map(item => sanitizeObjectForStorage(item));
  }
  
  if (data && typeof data === 'object') {
    const sanitized = {};
    for (const [key, value] of Object.entries(data)) {
      sanitized[key] = sanitizeObjectForStorage(value);
    }
    return sanitized;
  }
  
  return data;
}

/**
 * Sanitize filename for downloads
 * @param {string} filename - Original filename
 * @returns {string} - Safe filename
 */
export function sanitizeFilename(filename) {
  if (!filename || typeof filename !== 'string') return 'download';
  
  return filename
    .replace(/[^a-z0-9_\-\.]/gi, '_') // Only allow alphanumeric, underscore, dash, dot
    .replace(/_{2,}/g, '_') // Remove consecutive underscores
    .replace(/^[._]+|[._]+$/g, '') // Remove leading/trailing dots and underscores
    .toLowerCase()
    .substring(0, 100); // Limit length
}

/**
 * Validate and sanitize file extension
 * @param {string} ext - File extension
 * @param {string[]} allowedExts - Allowed extensions
 * @returns {string|null} - Valid extension or null
 */
export function sanitizeExtension(ext, allowedExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'webm', 'ogg']) {
  if (!ext || typeof ext !== 'string') return null;
  
  const clean = ext.toLowerCase().replace(/^\./, '');
  return allowedExts.includes(clean) ? clean : null;
}

/**
 * Check if URL is from same origin (for downloads)
 * @param {string} url - URL to check
 * @returns {boolean} - True if same origin or whitelisted
 */
export function isSafeOrigin(url) {
  try {
    const parsed = new URL(url, window.location.origin);
    
    // Same origin is always safe
    if (parsed.origin === window.location.origin) {
      return true;
    }
    
    // Add whitelist for trusted CDNs if needed
    const trustedOrigins = [
      // Add trusted CDN origins here
      // 'https://cdn.example.com'
    ];
    
    return trustedOrigins.includes(parsed.origin);
  } catch {
    return false;
  }
}

/**
 * Generate descriptive alt text for images
 * @param {object} item - Media item
 * @returns {string} - Descriptive alt text
 */
export function generateAltText(item) {
  if (!item) return 'Gallery media';
  
  const parts = [];
  
  if (item.title) parts.push(item.title);
  if (item.category) parts.push(`Category: ${item.category}`);
  if (item.desc) parts.push(item.desc);
  if (item.creator?.display_name) parts.push(`By ${item.creator.display_name}`);
  
  return parts.join(' - ') || 'Gallery media';
}

/**
 * Validate video source and return validation status
 * @param {string} src - Video source URL
 * @returns {object} - { isValid: boolean, isLocal: boolean, sanitizedSrc: string|null }
 */
export function validateVideoSource(src) {
  if (!src || typeof src !== 'string') {
    return { isValid: false, isLocal: false, sanitizedSrc: null };
  }
  
  try {
    const parsed = new URL(src, window.location.origin);
    
    // Check protocol
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return { isValid: false, isLocal: false, sanitizedSrc: null };
    }
    
    // Check if local
    const isLocal = parsed.origin === window.location.origin;
    
    // Validate extension
    const validExtensions = /\.(mp4|webm|ogg)$/i;
    const hasValidExt = validExtensions.test(parsed.pathname);
    
    // Allow if valid extension or no extension (streaming URLs)
    const hasExtension = /\.[a-z0-9]+$/i.test(parsed.pathname);
    const isValid = hasValidExt || !hasExtension;
    
    return {
      isValid,
      isLocal,
      sanitizedSrc: isValid ? parsed.href : null
    };
  } catch (err) {
    return { isValid: false, isLocal: false, sanitizedSrc: null };
  }
}
