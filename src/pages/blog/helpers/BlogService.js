/**
 * 📊 Blog Data Integration Module
 * 
 * Modul ini menghandle integrasi data blog dengan seluruh aplikasi.
 * Memastikan data consistency dan menyediakan context untuk semua komponen blog.
 */

import blogs from '../../../data/blog/data.json';

/**
 * Core Blog Service
 */
class BlogService {
  constructor(blogData) {
    this.blogs = blogData || [];
    this.validate();
  }

  /**
   * Validate blog data structure
   */
  validate() {
    if (!Array.isArray(this.blogs)) {
      console.warn('⚠️ Blog data is not an array');
      this.blogs = [];
    }
    
    // Check required fields
    const requiredFields = ['id', 'slug', 'title', 'author', 'date'];
    this.blogs.forEach((blog, idx) => {
      requiredFields.forEach(field => {
        if (!blog[field]) {
          console.warn(`⚠️ Blog[${idx}] missing required field: ${field}`);
        }
      });
    });
  }

  /**
   * Get single blog by slug
   */
  getBlogBySlug(slug) {
    return this.blogs.find(b => b.slug === slug) || null;
  }

  /**
   * Get single blog by ID
   */
  getBlogById(id) {
    return this.blogs.find(b => b.id === id) || null;
  }

  /**
   * Get all blogs by author name
   */
  getBlogsByAuthor(authorName) {
    return this.blogs.filter(b => 
      b.author && b.author.toLowerCase() === authorName.toLowerCase()
    );
  }

  /**
   * Get all blogs by category
   */
  getBlogsByCategory(category) {
    return this.blogs.filter(b => 
      b.category && b.category.toLowerCase() === category.toLowerCase()
    );
  }

  /**
   * Get all unique categories
   */
  getAllCategories() {
    return [...new Set(this.blogs.map(b => b.category).filter(Boolean))];
  }

  /**
   * Get all unique authors with their stats
   */
  getAllAuthorsWithStats() {
    const authorsMap = new Map();

    this.blogs.forEach(blog => {
      if (!blog.author) return;
      
      if (!authorsMap.has(blog.author)) {
        authorsMap.set(blog.author, {
          name: blog.author,
          avatar: blog.authorAvatar,
          bio: blog.authorBio,
          posts: [],
          totalViews: 0,
          totalLikes: 0
        });
      }

      const author = authorsMap.get(blog.author);
      author.posts.push(blog.slug);
      author.totalViews += blog.views || 0;
      author.totalLikes += blog.likes || 0;
    });

    return Array.from(authorsMap.values());
  }

  /**
   * Get related posts
   */
  getRelatedPosts(blogSlug, limit = 3) {
    const blog = this.getBlogBySlug(blogSlug);
    if (!blog) return [];

    let related = [];

    // First: Get explicitly related posts
    if (blog.relatedPosts && Array.isArray(blog.relatedPosts)) {
      related = blog.relatedPosts
        .map(slug => this.getBlogBySlug(slug))
        .filter(Boolean);
    }

    // Second: Add posts from same category if needed
    if (related.length < limit) {
      const sameCategoryPosts = this.getBlogsByCategory(blog.category)
        .filter(b => b.slug !== blogSlug && !related.find(r => r.slug === b.slug));
      
      related = [...related, ...sameCategoryPosts].slice(0, limit);
    }

    return related;
  }

  /**
   * Search blogs
   */
  searchBlogs(query) {
    if (!query || query.trim() === '') return this.blogs;

    const q = query.toLowerCase();
    return this.blogs.filter(blog => 
      blog.title.toLowerCase().includes(q) ||
      blog.excerpt?.toLowerCase().includes(q) ||
      blog.content?.toLowerCase().includes(q) ||
      blog.tags?.some(tag => tag.toLowerCase().includes(q)) ||
      blog.category?.toLowerCase().includes(q) ||
      blog.author?.toLowerCase().includes(q)
    );
  }

  /**
   * Sort blogs
   */
  sortBlogs(blogs, sortType = 'newest') {
    const sorted = [...blogs];

    switch (sortType) {
      case 'newest':
        return sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
      case 'popular':
        return sorted.sort((a, b) => (b.views || 0) - (a.views || 0));
      case 'trending':
        return sorted.sort((a, b) => (b.likes || 0) - (a.likes || 0));
      case 'rating':
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      default:
        return sorted;
    }
  }

  /**
   * Get featured blogs
   */
  getFeaturedBlogs(limit = 5) {
    return this.blogs
      .filter(b => b.featured === true)
      .slice(0, limit);
  }

  /**
   * Get recent blogs
   */
  getRecentBlogs(limit = 5) {
    return this.sortBlogs(this.blogs, 'newest').slice(0, limit);
  }

  /**
   * Get trending blogs
   */
  getTrendingBlogs(limit = 5) {
    return this.sortBlogs(this.blogs, 'trending').slice(0, limit);
  }

  /**
   * Get blog statistics
   */
  getStatistics() {
    return {
      totalPosts: this.blogs.length,
      totalAuthors: new Set(this.blogs.map(b => b.author)).size,
      totalCategories: this.getAllCategories().length,
      totalViews: this.blogs.reduce((sum, b) => sum + (b.views || 0), 0),
      totalLikes: this.blogs.reduce((sum, b) => sum + (b.likes || 0), 0),
      totalComments: this.blogs.reduce((sum, b) => sum + (b.commentCount || 0), 0),
      averageRating: this.blogs.length > 0 
        ? (this.blogs.reduce((sum, b) => sum + (b.rating || 0), 0) / this.blogs.length).toFixed(1)
        : 0
    };
  }

  /**
   * Validate blog consistency
   */
  validateConsistency() {
    const issues = [];

    this.blogs.forEach((blog, idx) => {
      // Check slug uniqueness
      const duplicateSlug = this.blogs.findIndex(b => b.slug === blog.slug);
      if (duplicateSlug !== idx) {
        issues.push(`Blog[${idx}]: Duplicate slug "${blog.slug}"`);
      }

      // Check ID uniqueness
      const duplicateId = this.blogs.findIndex(b => b.id === blog.id);
      if (duplicateId !== idx) {
        issues.push(`Blog[${idx}]: Duplicate ID "${blog.id}"`);
      }

      // Check related posts validity
      if (blog.relatedPosts && Array.isArray(blog.relatedPosts)) {
        blog.relatedPosts.forEach(slug => {
          if (!this.getBlogBySlug(slug)) {
            issues.push(`Blog[${idx}]: Related post slug "${slug}" not found`);
          }
        });
      }
    });

    if (issues.length > 0) {
      console.warn('⚠️ Blog Data Consistency Issues:');
      issues.forEach(issue => console.warn(`  - ${issue}`));
    }

    return issues;
  }
}

// Initialize service
const blogService = new BlogService(blogs);

// Validate on initialization
if (process.env.NODE_ENV === 'development') {
  blogService.validateConsistency();
}

export { BlogService };
export default blogService;
