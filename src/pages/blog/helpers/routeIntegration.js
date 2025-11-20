/**
 * 🔗 Blog Route Integration Helper
 * 
 * File ini menyediakan utility untuk memastikan integrasi route Blog dengan App.jsx
 * dan data handling yang konsisten di seluruh aplikasi.
 * 
 * Routes yang didukung:
 * - /blog                          → Halaman utama Blog
 * - /blog/:slug                    → Detail blog post
 * - /blog/authors/:slug            → Detail profile author
 * 
 * @module routeIntegration
 */

/**
 * Generate author slug dari nama author
 * @param {string} authorName - Nama author
 * @returns {string} Slug format (kebab-case)
 */
export const generateAuthorSlug = (authorName) => {
  if (!authorName) return '';
  return authorName
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
};

/**
 * Extract author name dari slug
 * @param {string} slug - Slug dari URL
 * @returns {string} Author name dalam Title Case
 */
export const extractAuthorNameFromSlug = (slug) => {
  if (!slug) return '';
  return slug
    .replace(/-/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Validate blog post slug
 * @param {string} slug - Slug yang akan divalidasi
 * @param {Array} blogs - Array dari blog posts
 * @returns {Object|null} Blog post jika ditemukan, null jika tidak
 */
export const validateBlogSlug = (slug, blogs) => {
  if (!slug || !Array.isArray(blogs)) return null;
  return blogs.find(blog => blog.slug === slug) || null;
};

/**
 * Get all unique authors dari blog data
 * @param {Array} blogs - Array dari blog posts
 * @returns {Array} Array berisi unique author names
 */
export const getUniqueAuthors = (blogs) => {
  if (!Array.isArray(blogs)) return [];
  const authors = new Set();
  blogs.forEach(blog => {
    if (blog.author) authors.add(blog.author);
  });
  return Array.from(authors).sort();
};

/**
 * Get all blogs dari specific author
 * @param {string} authorName - Nama author
 * @param {Array} blogs - Array dari blog posts
 * @returns {Array} Blog posts dari author tersebut
 */
export const getBlogsByAuthor = (authorName, blogs) => {
  if (!authorName || !Array.isArray(blogs)) return [];
  return blogs.filter(blog => 
    blog.author && blog.author.toLowerCase() === authorName.toLowerCase()
  );
};

/**
 * Get related posts
 * @param {Object} post - Current post
 * @param {Array} blogs - Array dari blog posts
 * @param {number} limit - Jumlah related posts
 * @returns {Array} Related blog posts
 */
export const getRelatedPosts = (post, blogs, limit = 3) => {
  if (!post || !Array.isArray(blogs)) return [];
  
  const related = blogs.filter(blog =>
    blog.slug !== post.slug &&
    (blog.category === post.category || 
     (post.relatedPosts && post.relatedPosts.includes(blog.slug)))
  );
  
  return related.slice(0, limit);
};

/**
 * Build complete blog context dengan semua data yang diperlukan
 * @param {Array} blogs - Raw blog data
 * @returns {Object} Complete blog context
 */
export const buildBlogContext = (blogs) => {
  return {
    totalPosts: blogs.length,
    totalAuthors: getUniqueAuthors(blogs).length,
    categories: [...new Set(blogs.map(b => b.category).filter(Boolean))],
    allAuthors: getUniqueAuthors(blogs),
    posts: blogs,
    stats: {
      totalViews: blogs.reduce((sum, b) => sum + (b.views || 0), 0),
      totalLikes: blogs.reduce((sum, b) => sum + (b.likes || 0), 0),
      totalComments: blogs.reduce((sum, b) => sum + (b.commentCount || 0), 0),
      avgRating: (blogs.reduce((sum, b) => sum + (b.rating || 0), 0) / blogs.length).toFixed(1)
    }
  };
};

/**
 * Generate navigation breadcrumb untuk blog pages
 * @param {string} pageType - Tipe halaman: 'main', 'detail', 'author'
 * @param {Object} data - Data untuk breadcrumb
 * @returns {Array} Array breadcrumb items
 */
export const generateBreadcrumb = (pageType, data = {}) => {
  const breadcrumbs = [
    { label: 'Home', path: '/' },
    { label: 'Blog', path: '/blog' }
  ];

  switch (pageType) {
    case 'detail':
      if (data.title) {
        breadcrumbs.push({
          label: data.title.substring(0, 50) + (data.title.length > 50 ? '...' : ''),
          path: `/blog/${data.slug}`
        });
      }
      break;
    case 'author':
      if (data.authorName) {
        breadcrumbs.push({
          label: `Author: ${data.authorName}`,
          path: `/blog/authors/${generateAuthorSlug(data.authorName)}`
        });
      }
      break;
  }

  return breadcrumbs;
};

export default {
  generateAuthorSlug,
  extractAuthorNameFromSlug,
  validateBlogSlug,
  getUniqueAuthors,
  getBlogsByAuthor,
  getRelatedPosts,
  buildBlogContext,
  generateBreadcrumb
};
