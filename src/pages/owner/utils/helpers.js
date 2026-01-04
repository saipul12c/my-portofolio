// Helper functions for Profile_admin page

/**
 * Get initials from a name
 * @param {string} name - Full name
 * @returns {string} - Initials (max 2 characters)
 */
export const getInitials = (name = "") => {
  return name
    .split(" ")
    .map(p => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
};

/**
 * Format date to human readable format (Indonesian)
 * @param {Date} d - Date object
 * @returns {string} - Formatted date string
 */
export const humanDate = (d = new Date()) => {
  return d.toLocaleDateString("id-ID", { 
    day: "numeric", 
    month: "long", 
    year: "numeric" 
  });
};

/**
 * Generate a stable color from a string
 * @param {string} str - Input string
 * @returns {string} - Hex color code
 */
export const generateColorFromString = (str) => {
  if (!str) return "#e5e7eb";
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let c = (hash & 0x00ffffff).toString(16).toUpperCase();
  c = "000000".substring(0, 6 - c.length) + c;
  return `#${c}`;
};

/**
 * Pick readable text color (black/white) based on background hex
 * @param {string} hex - Background color in hex format
 * @returns {string} - Text color (black or white)
 */
export const pickTextColor = (hex) => {
  try {
    if (!hex) return "#000";
    let c = hex.replace('#', '');
    if (c.length === 3) c = c.split('').map(ch => ch + ch).join('');
    const r = parseInt(c.substring(0,2), 16);
    const g = parseInt(c.substring(2,4), 16);
    const b = parseInt(c.substring(4,6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.6 ? '#0f172a' : '#ffffff';
  } catch {
    return '#fff';
  }
};

/**
 * Calculate total impact from all projects
 * @param {Array} projects - Array of project objects
 * @returns {number} - Total impact number
 */
export const calculateTotalImpact = (projects) => {
  const impacts = projects.map(p => {
    const impactText = p.impact || "";
    const match = impactText.match(/\d+/);
    return match ? parseInt(match[0]) : 0;
  });
  return impacts.reduce((a, b) => a + b, 0);
};

/**
 * Calculate blog statistics for a specific author
 * @param {Array} blogs - Array of blog objects
 * @param {string} authorName - Name of the author
 * @returns {Object} - Blog statistics
 */
export const calculateBlogStats = (blogs, authorName = "Syaiful Mukmin") => {
  const authorBlogs = blogs.filter(blog => blog.author === authorName);
  
  return {
    totalArticles: authorBlogs.length,
    totalViews: authorBlogs.reduce((sum, blog) => sum + (blog.views || 0), 0),
    totalLikes: authorBlogs.reduce((sum, blog) => sum + (blog.likes || 0), 0),
    totalShares: authorBlogs.reduce((sum, blog) => sum + (blog.shares || 0), 0),
    totalComments: authorBlogs.reduce((sum, blog) => sum + (blog.commentCount || 0), 0),
    averageRating: authorBlogs.length > 0 
      ? (authorBlogs.reduce((sum, blog) => sum + (blog.rating || 0), 0) / authorBlogs.length).toFixed(1)
      : 0,
    featuredCount: authorBlogs.filter(blog => blog.featured).length,
    categories: [...new Set(authorBlogs.map(blog => blog.category))],
    totalWordCount: authorBlogs.reduce((sum, blog) => sum + (blog.wordCount || 0), 0)
  };
};

/**
 * Sort and slice items by date (newest first)
 * @param {Array} items - Array of items with date property
 * @param {number} limit - Number of items to return
 * @returns {Array} - Sorted and sliced array
 */
export const getRecentItems = (items, limit) => {
  return [...items]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, limit);
};

/**
 * Sort and slice items by year (newest first)
 * @param {Array} items - Array of items with year property
 * @param {number} limit - Number of items to return
 * @returns {Array} - Sorted and sliced array
 */
export const getRecentItemsByYear = (items, limit) => {
  return [...items]
    .sort((a, b) => b.year - a.year)
    .slice(0, limit);
};

/**
 * Filter items by experience/level threshold
 * @param {Array} items - Array of items with experience property
 * @param {number} threshold - Minimum experience value
 * @param {number} limit - Number of items to return
 * @returns {Array} - Filtered and sliced array
 */
export const getTopItemsByExperience = (items, threshold, limit) => {
  return items
    .filter(item => item.experience >= threshold)
    .slice(0, limit);
};

/**
 * Filter items by priority
 * @param {Array} items - Array of items with metadata.priority property
 * @param {string} priority - Priority level (e.g., "High")
 * @param {number} limit - Number of items to return
 * @returns {Array} - Filtered and sliced array
 */
export const getItemsByPriority = (items, priority, limit) => {
  return items
    .filter(item => item.metadata?.priority === priority)
    .slice(0, limit);
};
